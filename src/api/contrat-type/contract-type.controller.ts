import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { ContractTypeService } from './contract-type.service';

import { ContractTypeCRUDMessage } from './message/contrat-type.message';
import { PaginationParams } from 'src/core/pagination/page-option.dto';
import { Public } from 'src/core/decorators/public.decorator';

@Public()
@Controller('contract-types')
export class ContractTypeController {
  constructor(private readonly contractTypeService: ContractTypeService) {}

  @Get()
  findAll(@Query() { limit, skip }: PaginationParams) {
    return this.contractTypeService.findAll(skip, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const contractType = await this.contractTypeService.findOne(id);
    if (contractType) {
      return {
        message: ContractTypeCRUDMessage.READ_SUCCESS,
        entity: contractType,
        status: 200,
      };
    }
    throw new NotFoundException(ContractTypeCRUDMessage.READ_ERROR);
  }
}
