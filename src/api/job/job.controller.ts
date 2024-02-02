import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { JobService } from './job.service';
import { JobCRUDMessage } from './message/contrat-type.message';
import { PaginationParamsSearch } from 'src/core/pagination/page-option.dto';

import { Abilitys } from 'src/core/decorators/public.decorator';
import { AbilitysEnum } from '../auth/tools/token.builder';

@Abilitys(AbilitysEnum.DEFAULT_ABILITYS)
@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  findAll(@Query() { limit, skip, filter }: PaginationParamsSearch) {
    return this.jobService.findAll({ skip, limit, filter });
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
}
