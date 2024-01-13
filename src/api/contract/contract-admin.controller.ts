import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { CreateContractAdminDto } from './dto/create-contract.dto';

import { FormDataRequest } from 'nestjs-form-data';
import { CurrentUser } from 'src/core/decorators/current-user.decorators';
import { User } from '../user/schemas/user.schema';
import { PaginationParams } from 'src/core/pagination/page-option.dto';
import { ContratCRUDMessage } from './message/contrat.message';
import { ContractAdminService } from './contract-admin.service';

@Controller('contract-admin')
export class ContractAdminController {
  constructor(private readonly contractAdminService: ContractAdminService) {}

  @Post()
  @FormDataRequest()
  async createAdmin(@Body() createContractDto: CreateContractAdminDto) {
    const contrat = await this.contractAdminService.create(createContractDto);
    if (contrat) {
      return {
        message: ContratCRUDMessage.CREATE_SUCCESS,
        entity: contrat,
        status: 201,
      };
    }
    throw new BadRequestException(ContratCRUDMessage.CREATE_ERROR);
  }
  @Patch(':id')
  @FormDataRequest()
  async updateAdmin(
    @Param('id') id: string,
    @Body() createContractDto: CreateContractAdminDto,
  ) {
    const contrat = await this.contractAdminService.update(
      id,
      createContractDto,
    );
    if (contrat) {
      return {
        message: ContratCRUDMessage.UPDATE_SUCCESS,
        entity: contrat,
        status: 201,
      };
    }
    throw new BadRequestException(ContratCRUDMessage.UPDATE_ERROR);
  }

  @Get()
  findAll(
    @CurrentUser() user: User,
    @Query() { limit, skip }: PaginationParams,
  ) {
    return this.contractAdminService.findAll(skip, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const contrat = await this.contractAdminService.findOne(id);
    if (contrat) {
      return {
        message: ContratCRUDMessage.READ_SUCCESS,
        entity: contrat,
        status: 200,
      };
    }
    throw new NotFoundException(ContratCRUDMessage.READ_ERROR);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const contrat = await this.contractAdminService.remove(id);
    if (contrat) {
      return {
        message: ContratCRUDMessage.DELETE_SUCCESS,
        entity: contrat,
        status: 201,
      };
    }
    throw new NotFoundException(ContratCRUDMessage.DELETE_ERROR);
  }
}
