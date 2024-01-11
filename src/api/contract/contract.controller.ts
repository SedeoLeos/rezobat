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
import { ContractService } from './contract.service';
import {
  CreateContractAdminDto,
  CreateContractDto,
} from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

import { FormDataRequest } from 'nestjs-form-data';
import { CurrentUser } from 'src/core/decorators/current-user.decorators';
import { User } from '../user/schemas/user.schema';
import { PaginationParams } from 'src/core/pagination/page-option.dto';
import { ContratCRUDMessage } from './message/contrat.message';

@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post()
  @FormDataRequest()
  async create(
    @Body() createContractDto: CreateContractDto,
    @CurrentUser() user: User,
  ) {
    const contrat = await this.contractService.create(createContractDto, user);
    if (contrat) {
      return {
        message: ContratCRUDMessage.CREATE_SUCCESS,
        entity: contrat,
        status: 201,
      };
    }
    throw new BadRequestException(ContratCRUDMessage.CREATE_ERROR);
  }
  @Post('admin/')
  @FormDataRequest()
  async createAdmin(@Body() createContractDto: CreateContractAdminDto) {
    const contrat = await this.contractService.createAdmin(createContractDto);
    if (contrat) {
      return {
        message: ContratCRUDMessage.CREATE_SUCCESS,
        entity: contrat,
        status: 201,
      };
    }
    throw new BadRequestException(ContratCRUDMessage.CREATE_ERROR);
  }

  @Get()
  findAll(
    @CurrentUser() user: User,
    @Query() { limit, skip }: PaginationParams,
  ) {
    return this.contractService.findAll(user, skip, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const contrat = await this.contractService.findOne(id);
    if (contrat) {
      return {
        message: ContratCRUDMessage.READ_SUCCESS,
        entity: contrat,
        status: 200,
      };
    }
    throw new NotFoundException(ContratCRUDMessage.READ_ERROR);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateContractDto: UpdateContractDto,
  ) {
    const contrat = await this.contractService.update(id, updateContractDto);
    if (contrat) {
      return {
        message: ContratCRUDMessage.UPDATE_SUCCESS,
        entity: contrat,
        status: 201,
      };
    }
    throw new NotFoundException(ContratCRUDMessage.UPDATE_ERROR);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const contrat = await this.contractService.remove(id);
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
