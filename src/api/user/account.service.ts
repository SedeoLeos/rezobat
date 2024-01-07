import {
  BadRequestException,
  Injectable,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as argon from 'argon2';
import { UploadUserimageDto } from './dto/upload-user.dto';
import { isFile } from 'nestjs-form-data';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Media } from '../media/schemas/media.schema';
@Injectable()
export class AccountService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
    private eventEmitter: EventEmitter2,
  ) {}
  async activeCompte(user: User) {
    return await this.model.findOneAndUpdate(user._id, { active: true });
  }
  async updatePassword(user: User, value: string) {
    const password = await argon.hash(value);
    return await this.model.findOneAndUpdate(user._id, { password });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.model.findByIdAndUpdate(id, updateUserDto).exec();
  }
  async upload(id: string, updateUserDto: UploadUserimageDto) {
    const { photo } = updateUserDto;
    if (!photo || !isFile(photo)) {
      throw new UnsupportedMediaTypeException();
    }
    const found = await this.model
      .findOne({ _id: id })
      .populate('photo')
      .exec();
    if (!found) {
      throw new BadRequestException();
    }
    let newphoto: Media;
    if (found.photo) {
      const { photo: old } = found;
      newphoto = (await this.eventEmitter.emitAsync('Media.updated', {
        old,
        file: photo,
        folder: 'user/',
      })[0]) as Media;
    } else {
      newphoto = (await this.eventEmitter.emitAsync('Media.created', {
        file: photo,
        folder: 'user/',
      })[0]) as Media;
    }
    return await this.model.findByIdAndUpdate(id, { photo: newphoto }).exec();
  }

  async remove(id: string) {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
