import { Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Media, MediaDocument } from './schemas/media.schema';
import { Model } from 'mongoose';

@Injectable()
export class MediaService {
  constructor(@InjectModel(Media.name) private model: Model<MediaDocument>) {}
  async create(createMediaDto: CreateMediaDto) {
    return await new this.model({ ...createMediaDto }).save();
  }

  async findAll() {
    return this.model.find().exec();
  }

  async findOne(id: string) {
    return await this.model.findOne({ id }).exec();
  }

  async update(id: string, updateMediaDto: UpdateMediaDto) {
    return await this.model.findByIdAndUpdate(id, updateMediaDto).exec();
  }

  async remove(id: string) {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
