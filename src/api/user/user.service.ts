import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto } from '../auth/dto/register.dto';
import { MailService } from 'src/core/mail/mail.service';
import * as argon from 'argon2';
import { randomBytes } from 'crypto';
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
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
    private mail_service: MailService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const password = await generatePassword(8);
      const hash = argon.hash(password);
      const user = await new this.model({
        ...createUserDto,
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
    const query = this.model.find().skip(skip);
    if (limit) {
      query.limit(limit);
    }
    const data = await query.exec();
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
    return await this.model.findOne({ email });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.model.findByIdAndUpdate(id, updateUserDto).exec();
  }
  async updateSimple(id: string, updateUserDto: { [x: string]: any }) {
    return await this.model.findByIdAndUpdate(id, updateUserDto).exec();
  }
  async remove(id: string) {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
