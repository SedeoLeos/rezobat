import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Job, JobDocument } from './schema/job.schema';
import { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { isFile } from 'nestjs-form-data';

@Injectable()
export class JobService {
  constructor(
    @InjectModel(Job.name) private model: Model<JobDocument>,
    private eventEmitter: EventEmitter2,
  ) {}
  async create(createCategoryDto: CreateJobDto) {
    console.log('ÄÄÄÄÄÄ', isFile(createCategoryDto.image));
    const { image: file, ...result } = createCategoryDto;
    let categoryField: Record<string, any> = { ...result };
    if (file) {
      const imagePayload = await this.eventEmitter.emitAsync('Media.created', {
        file: createCategoryDto.image,
        folder: 'job',
      });
      categoryField =
        imagePayload && imagePayload.length > 0
          ? { ...categoryField, photo: imagePayload[0] }
          : categoryField;
    }
    return await new this.model({
      ...categoryField,
    }).save();
  }

  async findAll(skip = 0, limit?: number) {
    const count = await this.model.countDocuments({}).exec();
    const page_total = Math.floor((count - 1) / limit) + 1;
    const query = this.model.find().populate('image').skip(skip);
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
    return await this.model.findOne({ _id: id }).populate('image').exec();
  }

  async update(id: string, updateJobDto: UpdateJobDto) {
    const found = await this.model.findOne({ _id: id }).populate('image');
    delete updateJobDto.id;
    const { image: file, ...result } = updateJobDto;
    const { image } = found;
    let categoryField: Record<string, any> = { ...result };
    if (file) {
      const imagePayload = image
        ? await this.eventEmitter.emitAsync('Media.updated', {
            old: image,
            file,
            folder: 'job',
          })
        : await this.eventEmitter.emitAsync('Media.created', {
            file,
            folder: 'job',
          });
      categoryField =
        imagePayload && imagePayload.length > 0
          ? { ...categoryField, photo: imagePayload[0] }
          : categoryField;
    }
    return await this.model.findByIdAndUpdate(id, { ...categoryField }).exec();
  }

  async remove(id: string) {
    return await this.model.findByIdAndDelete(id).populate('image').exec();
  }
}
