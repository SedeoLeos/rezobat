import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument, arrayRole } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { RegisterDto } from '../auth/dto/register.dto';
import { MailService } from 'src/core/mail/mail.service';
import * as argon from 'argon2';
import { randomBytes } from 'crypto';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { ConfigService } from '@nestjs/config';
import { UserPaginationParams } from './dto/paginate-users.dto';

const generatePassword = async (length: number): Promise<string> => {
  if (length < 1) {
    throw new Error('Length must be greater than 0');
  }

  // Create a new buffer with the specified length.
  const buffer = randomBytes(length);

  // Convert the buffer to an array of numbers.
  const array = Array.from(buffer);

  // Initialize an empty string to hold the generated password.
  let password = '';

  // Define the characters that can be used in the password.
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  // Iterate over the array of random values and add characters to the password.
  for (let i = 0; i < length; i++) {
    // Use the modulus operator to get a random index in the characters string
    // and add the corresponding character to the password.
    password += characters.charAt(array[i] % characters.length);
  }

  // Return the generated password.
  return password;
};
const POPULATE = ['photo', 'jobs'];
@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
    private mail_service: MailService,
    private eventEmitter: EventEmitter2,
    private configService: ConfigService,
  ) {}
  async onModuleInit() {
    const hash = await argon.hash('admin123');
    const user: Partial<User> = {
      email: this.configService.get('ADMIN_EMAIL') ?? 'sample@gmail.com',
      first_name: this.configService.get('ADMIN_FIRST'),
      last_name: this.configService.get('ADMIN_LAST'),
      phone: this.configService.get('ADMIN_PHONE') ?? '+242060000000',
      password: hash,
      role: arrayRole[2],
      isAdmin: true,
      active: true,
    };
    const found = await this.model.findOne({ isAdmin: true }).exec();
    if (!found) {
      await new this.model(user).save();
    }
  }

  async create(createUserDto: CreateUserDto) {
    const { photo: file, ...result } = createUserDto;
    try {
      const password = await generatePassword(8);
      const hash = await argon.hash(password);

      let userFields: Record<string, any> = { ...result };
      // Check if a file is present
      if (file) {
        const newPhoto = await this.eventEmitter.emitAsync('Media.created', {
          file,
          folder: 'user/',
        });

        // If new photo is created, update userFields
        userFields =
          newPhoto && newPhoto.length > 0
            ? { ...userFields, photo: newPhoto[0] }
            : userFields;
      }
      const user = await new this.model({
        ...userFields,
        password: hash,
        active: true,
      }).save();
      await this.mail_service.create(user, password, user.email);
      return user;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
  async createSimple(createUserDto: RegisterDto) {
    return await new this.model({ ...createUserDto }).save();
  }

  async findAll(skip = 0, limit?: number) {
    const count = await this.model.countDocuments({}).exec();
    const page_total = Math.floor((count - 1) / limit) + 1;
    const query = this.model.find().sort({ createdAt: 'desc' }).skip(skip);
    if (limit) {
      query.limit(limit);
    }
    const data = await query.populate(POPULATE).exec();
    return {
      data: data,
      page_total: page_total,
      status: 200,
    };
  }
  async search({
    skip = 0,
    jobs,
    limit = 10,
    filter,
    role,
  }: UserPaginationParams) {
    const filterQuery: FilterQuery<User> = {};

    if (Array.isArray(jobs)) {
      filterQuery['jobs.name'] = { $in: jobs };
    }

    // @ts-ignore
    // Array are often parsed as value1,value2,value3...
    if (typeof jobs === 'string' && jobs.length) {
      // @ts-ignore
      filterQuery['jobs'] = { $in: jobs.split(',') };
    }

    if (filter) {
      filterQuery.$or = [
        {
          first_name: {
            $regex: new RegExp(filter),
            $options: 'si',
          },
        },
        {
          last_name: {
            $regex: new RegExp(filter),
            $options: 'si',
          },
        },
      ];
    }

    if (role) {
      filterQuery.role = role;
    }

    const count = await this.model.countDocuments(filterQuery).exec();
    const page_total = Math.floor((count - 1) / limit) + 1;
    const query = this.model.find(filterQuery).skip(skip);
    if (limit) {
      query.limit(limit);
    }
    const data = await query.populate(POPULATE).exec();
    return {
      data: data,
      page_total: page_total,
      status: 200,
    };
  }

  async findOne(id: string) {
    return await this.model.findOne({ id });
  }
  async findBy(email: string) {
    return await this.model.findOne({ email }).populate('photo').exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    delete updateUserDto.id;
    const { photo: file, ...partialUser } = updateUserDto;
    const user = await this.model
      .findOne({ _id: id })
      .populate(POPULATE)
      .exec();
    if (!user) {
      return;
    }
    let updateFields: Record<string, any> = { ...partialUser };
    // Check if a file is present
    if (file) {
      // Determine whether to update or create media
      const imagePayload = user.photo
        ? await this.eventEmitter.emitAsync('Media.updated', {
            old: user.photo,
            file,
            folder: 'user',
          })
        : await this.eventEmitter.emitAsync('Media.created', {
            file,
            folder: 'user',
          });
      updateFields =
        imagePayload && imagePayload.length > 0
          ? { ...updateFields, photo: imagePayload[0] }
          : updateFields;
    }
    return await this.model.findByIdAndUpdate(id, { ...updateFields }).exec();
  }

  async updateSimple(id: string, updateUserDto: Partial<User>) {
    return await this.model
      .findByIdAndUpdate(id, updateUserDto, {
        new: true,
      })
      .populate(POPULATE)
      .exec();
  }

  async remove(id: string) {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
