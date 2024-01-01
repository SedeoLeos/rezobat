import { Injectable } from '@nestjs/common';
import { CreateRequestForServiceDto } from './dto/create-request_for_service.dto';
import { UpdateRequestForServiceDto } from './dto/update-request_for_service.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  RequestForService,
  RequestForServiceDocument,
} from './schemas/request_for_service.schema';
import { Model } from 'mongoose';

@Injectable()
export class RequestForServiceService {
  constructor(
    @InjectModel(RequestForService.name)
    private model: Model<RequestForServiceDocument>,
  ) {}
  async create(createRequestForServiceDto: CreateRequestForServiceDto) {
    return await new this.model({ ...createRequestForServiceDto }).save();
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
