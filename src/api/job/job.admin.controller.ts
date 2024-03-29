import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobCRUDMessage } from './message/contrat-type.message';
import { PaginationParams } from 'src/core/pagination/page-option.dto';

import { FormDataRequest } from 'nestjs-form-data';
import { InjectPkToBody } from 'src/core/validator/decorators';
import { Abilitys } from 'src/core/decorators/public.decorator';
import { AbilitysEnum } from '../auth/tools/token.builder';

@Abilitys(AbilitysEnum.ADMIN)
@Controller('admin/jobs')
export class AdminJobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @FormDataRequest()
  async create(@Body() createJobDto: CreateJobDto) {
    console.log(createJobDto);
    const job = await this.jobService.create(createJobDto);
    if (job) {
      return {
        message: JobCRUDMessage.CREATE_SUCCESS,
        entity: job,
        status: 201,
      };
    }
    throw new BadRequestException(JobCRUDMessage.CREATE_ERROR);
  }

  @Get()
  findAll(@Query() params: PaginationParams) {
    return this.jobService.findAll(params);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const job = await this.jobService.findOne(id);
    if (job) {
      return {
        message: JobCRUDMessage.READ_SUCCESS,
        entity: job,
        status: 200,
      };
    }
    throw new NotFoundException(JobCRUDMessage.READ_ERROR);
  }

  @Patch(':id')
  @InjectPkToBody({ dtoField: 'id', paramsName: 'id' })
  @FormDataRequest()
  async update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    const job = await this.jobService.update(id, updateJobDto);
    if (job) {
      return {
        message: JobCRUDMessage.UPDATE_SUCCESS,
        entity: job,
        status: 201,
      };
    }
    throw new BadRequestException(JobCRUDMessage.UPDATE_ERROR);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const job = await this.jobService.remove(id);
    if (job) {
      return {
        message: JobCRUDMessage.DELETE_SUCCESS,
        entity: job,
        status: 201,
      };
    }
    throw new BadRequestException(JobCRUDMessage.DELETE_ERROR);
  }
}
