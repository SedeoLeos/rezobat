import { Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Media, MediaDocument } from './schemas/media.schema';
import { Model } from 'mongoose';
import { OnEvent } from '@nestjs/event-emitter';
import { LocalStorageFile } from './media.strore';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(Media.name) private model: Model<MediaDocument>,
    private file_storage: LocalStorageFile,
  ) {}
  @OnEvent('Media.created')
  async create(createMediaDto: CreateMediaDto) {
    try {
      const data = await this.file_storage.saveFile(
        createMediaDto.file,
        createMediaDto.folder,
      );
      console.log(data);
      return await new this.model({ ...data }).save();
    } catch {
      return;
    }
  }

  @OnEvent('Media.updated')
  async update(updateMediaDto: UpdateMediaDto) {
    const { old, file, folder } = updateMediaDto;
    await this.file_storage.removeImage(old.url);
    const data = await this.file_storage.saveFile(file, folder);
    return await this.model
      .findByIdAndUpdate(old._id, data, { new: true })
      .exec();
  }

  @OnEvent('Media.removed')
  async remove(old: Media) {
    await this.file_storage.removeImage(old.url);
    return await this.model.findByIdAndDelete(old._id).exec();
  }
}
