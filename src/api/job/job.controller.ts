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

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  async create(@Body() createJobDto: CreateJobDto) {
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
  findAll(@Query() { limit, skip }: PaginationParams) {
    return this.jobService.findAll(skip, limit);
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
