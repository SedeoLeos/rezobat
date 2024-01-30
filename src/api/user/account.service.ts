import {
  BadRequestException,
  Injectable,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as argon from 'argon2';
import { UploadUserimageDto } from './dto/upload-user.dto';
import { isFile } from 'nestjs-form-data';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Media } from '../media/schemas/media.schema';
import { UpdateUserInfoDto } from './dto/update-user.dto';
import { AddJob, RemoveJob } from './dto/accountJob.dto';
import { Job } from '../job/schema/job.schema';
@Injectable()
export class AccountService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
    private eventEmitter: EventEmitter2,
  ) {}
  async activeCompte(user: User) {
    try {
      return await this.model.findOneAndUpdate(user.id, { active: true });
    } catch (e) {
      return null;
    }
  }
  async resetPassword(user: User, value: string) {
    try {
      const password = await argon.hash(value);
      return await this.model.findOneAndUpdate(user.id, { password });
    } catch (e) {
      return null;
    }
  }
  async updatePassword(id: string, value: string, old: string) {
    try {
      const _user = await this.model.findOne({ _id: id });
      const isMatch = await argon.verify(_user.password, old);

      if (isMatch) {
        const password = await argon.hash(value);

        return await this.model.findByIdAndUpdate(id, { password });
      }
      return;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async upload(id: string, updateUserDto: UploadUserimageDto) {
    try {
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
    } catch (e) {
      return null;
    }
  }
  async addJob(id: string, payload: AddJob) {
    try {
      const user = await this.model.findById(id).populate('jobs');
      if (!user) return user;
      const { jobs } = user;
      payload.job
        .map((item) => ({ _id: item }))
        .forEach((item) => {
          const ids = jobs.map(({ _id }) => _id);
          if (ids.includes(item._id)) {
            jobs.push(item as Job);
          }
        });
      return this.model.findByIdAndUpdate(id, { jobs }).exec();
    } catch (e) {
      return null;
    }
  }
  async removeJob(id: string, payload: RemoveJob) {
    try {
      const user = await this.model.findById(id).populate('jobs');
      if (!user) return user;

      const { jobs } = user;
      const jobsToRemove = payload.job
        .map((item) => ({ _id: item }))
        .map((item) => item._id);

      // Filter out jobs that need to be removed
      const updatedJobs = jobs.filter(({ _id }) => !jobsToRemove.includes(_id));

      // Update the user with the modified jobs array
      const updatedUser = await this.model
        .findByIdAndUpdate(id, { jobs: updatedJobs }, { new: true })
        .exec();

      return updatedUser;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
  async updateInfo(id: string, updateInfo: UpdateUserInfoDto) {
    try {
      return this.model.findByIdAndUpdate(id, { ...updateInfo });
    } catch (e) {
      return null;
    }
  }

  /**
   * WARNING!!!!!: DO some checks before.
   * And eventually also delete related data...
   * 
   * Or a better way would be to implement a soft delete. 
   */
  async remove(id: string) {
    try {
      return await this.model.findByIdAndDelete(id).exec();
    } catch (e) {
      return null;
    }
  }
}
