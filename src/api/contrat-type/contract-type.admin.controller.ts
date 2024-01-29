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
import { ContractTypeService } from './contract-type.service';
import { CreateContractTypeDto } from './dto/create-contrat-type.dto';
import { UpdateContractTypeDto } from './dto/update-contrat-type.dto';
import { ContractTypeCRUDMessage } from './message/contrat-type.message';
import { PaginationParams } from 'src/core/pagination/page-option.dto';
import { InjectPkToBody } from 'src/core/validator/decorators';
import { Public } from 'src/core/decorators/public.decorator';

@Public()
@Controller('admin/contract-types')
export class AdminContractTypeController {
  constructor(private readonly contractTypeService: ContractTypeService) {}

  @Post()
  async create(@Body() createContractTypeDto: CreateContractTypeDto) {
    const contractType = await this.contractTypeService.create(
      createContractTypeDto,
    );
    if (contractType) {
      return {
        message: ContractTypeCRUDMessage.CREATE_SUCCESS,
        entity: contractType,
        status: 201,
      };
    }
    throw new BadRequestException(ContractTypeCRUDMessage.CREATE_ERROR);
  }

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

  @Patch(':id')
  @InjectPkToBody({ dtoField: 'id', paramsName: 'id' })
  async update(
    @Param('id') id: string,
    @Body() updateContratTypeDto: UpdateContractTypeDto,
  ) {
    const contractType = await this.contractTypeService.update(
      id,
      updateContratTypeDto,
    );
    if (contractType) {
      return {
        message: ContractTypeCRUDMessage.UPDATE_SUCCESS,
        entity: contractType,
        status: 201,
      };
    }
    throw new NotFoundException(ContractTypeCRUDMessage.UPDATE_ERROR);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const contractType = await this.contractTypeService.remove(id);
    if (contractType) {
      return {
        message: ContractTypeCRUDMessage.DELETE_SUCCESS,
        entity: contractType,
        status: 201,
      };
    }
    throw new NotFoundException(ContractTypeCRUDMessage.DELETE_ERROR);
  }
}
