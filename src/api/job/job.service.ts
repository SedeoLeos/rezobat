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
    if (isFile(createCategoryDto.image)) {
      const imagePayload = await this.eventEmitter.emitAsync('Media.created', {
        file: createCategoryDto.image,
        folder: 'job',
      });
      if (!imagePayload) {
        return;
      }
      return await new this.model({
        ...createCategoryDto,
        image: imagePayload[0],
      }).save();
    }
    delete createCategoryDto.image;
    return await new this.model({
      ...createCategoryDto,
    }).save();
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
    const entity = await this.model.findOne({ _id: id }).exec();

    return {
      entity,
      status: 200,
    };
  }

  async update(id: string, updateJobDto: UpdateJobDto) {
    const found = await this.model.findOne({ _id: id }).populate('image');
    const { image: file } = updateJobDto;
    const { image } = found;
    if (file && isFile(file) && image) {
      const imagePayload = await this.eventEmitter.emitAsync('Media.updated', {
        old: image,
        file,
        folder: 'category',
      });
      if (!imagePayload && !imagePayload[0]) {
      }
      return await this.model
        .findByIdAndUpdate(id, { ...updateJobDto, image: imagePayload[0] })
        .exec();
    }
    delete updateJobDto.image;
    return await this.model.findByIdAndUpdate(id, { ...updateJobDto }).exec();
  }

  async remove(id: string) {
    return await this.model.findByIdAndDelete(id);
  }
}
