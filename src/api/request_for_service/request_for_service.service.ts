import { Injectable } from '@nestjs/common';
import { CreateRequestForServiceDto } from './dto/create-request_for_service.dto';
import { UpdateRequestForServiceDto } from './dto/update-request_for_service.dto';

@Injectable()
export class RequestForServiceService {
  create(createRequestForServiceDto: CreateRequestForServiceDto) {
    return 'This action adds a new requestForService';
  }

  findAll() {
    return `This action returns all requestForService`;
  }

  findOne(id: number) {
    return `This action returns a #${id} requestForService`;
  }

  update(id: number, updateRequestForServiceDto: UpdateRequestForServiceDto) {
    return `This action updates a #${id} requestForService`;
  }

  remove(id: number) {
    return `This action removes a #${id} requestForService`;
  }
}
