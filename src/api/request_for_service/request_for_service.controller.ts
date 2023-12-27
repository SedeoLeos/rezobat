import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RequestForServiceService } from './request_for_service.service';
import { CreateRequestForServiceDto } from './dto/create-request_for_service.dto';
import { UpdateRequestForServiceDto } from './dto/update-request_for_service.dto';

@Controller('request-for-service')
export class RequestForServiceController {
  constructor(private readonly requestForServiceService: RequestForServiceService) {}

  @Post()
  create(@Body() createRequestForServiceDto: CreateRequestForServiceDto) {
    return this.requestForServiceService.create(createRequestForServiceDto);
  }

  @Get()
  findAll() {
    return this.requestForServiceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestForServiceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRequestForServiceDto: UpdateRequestForServiceDto) {
    return this.requestForServiceService.update(+id, updateRequestForServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestForServiceService.remove(+id);
  }
}
