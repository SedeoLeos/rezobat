import { Injectable } from '@nestjs/common';
import { CreateRequestForServiceDto } from './dto/create-request_for_service.dto';
import { UpdateRequestForServiceDto } from './dto/update-request_for_service.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  RequestForService,
  RequestForServiceDocument,
} from './schemas/request_for_service.schema';
import { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class RequestForServiceService {
  constructor(
    @InjectModel(RequestForService.name)
    private model: Model<RequestForServiceDocument>,
    private eventEmiter: EventEmitter2,
  ) {}
  async create(createRequestForServiceDto: CreateRequestForServiceDto) {
    const { provider_id, category_id, sub_category_id, files, ...result } =
      createRequestForServiceDto;
    if (files) {
      const medias = files.map((file) => ({
        file: file,
        forlder: 'request',
      }));
      const filesMedia = await this.eventEmiter.emitAsync(
        'Media.created',
        ...medias,
      );
      const sub_category = sub_category_id.map((item) => ({ _id: item }));
      return await new this.model({
        ...result,
        files: filesMedia,
        provider: {
          _id: provider_id,
          category: { _id: category_id },
          sub_category,
        },
      }).save();
    }
    const sub_category = sub_category_id.map((item) => ({ _id: item }));
    return await new this.model({
      ...result,
      provider: {
        _id: provider_id,
        category: { _id: category_id },
        sub_category,
      },
    }).save();
  }

  async findAll() {
    return await this.model.find().exec();
  }

  async findOne(id: string) {
    return await this.model.findOne({ id }).exec();
  }

  update(id: string, updateRequestForServiceDto: UpdateRequestForServiceDto) {
    return this.model.findByIdAndUpdate(id, updateRequestForServiceDto);
  }

  async remove(id: string) {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
