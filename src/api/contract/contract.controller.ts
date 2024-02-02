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
  Put,
} from '@nestjs/common';
import { ContractService } from './contract.service';
import { CreateContractDto } from './dto/create-contract.dto';
import {
  UpdateContractDto,
  UpdateContractStatusDto,
} from './dto/update-contract.dto';

import { FormDataRequest } from 'nestjs-form-data';
import { CurrentUser } from 'src/core/decorators/current-user.decorators';
import { User } from '../user/schemas/user.schema';
import { ContractPaginationParams } from 'src/core/pagination/page-option.dto';
import { ContratCRUDMessage } from './message/contrat.message';
import { Abilitys, Public } from 'src/core/decorators/public.decorator';
import { AbilitysEnum } from '../auth/tools/token.builder';

@Abilitys(AbilitysEnum.ACTIVE_USER)
@Controller('contracts')
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

  @Get()
  findAll(
    @CurrentUser() user: User,
    @Query() params: ContractPaginationParams,
  ) {
    return this.contractService.findAll(user, params);
  }

  @Get('stats')
  getUserStats(@CurrentUser() user: User) {
    return this.contractService.getUserStats(user);
  }

  @Get('count-in-progress')
  countInProgress(@CurrentUser() user: User) {
    return this.contractService.getInProgressCount(user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const contrat = await this.contractService.findOne(id);
    console.log(contrat, id);
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
    @CurrentUser() user: User,
  ) {
    const contrat = await this.contractService.update(
      user,
      id,
      updateContractDto,
    );
    if (contrat) {
      return {
        message: ContratCRUDMessage.UPDATE_SUCCESS,
        entity: contrat,
        status: 201,
      };
    }
    throw new NotFoundException(ContratCRUDMessage.UPDATE_ERROR);
  }
  @Put(':id/status')
  async statusUpdate(
    @Param('id') id: string,
    @Body() updateContractStatusDto: UpdateContractStatusDto,
  ) {
    const contrat = await this.contractService.statusUpdate(
      id,
      updateContractStatusDto,
    );
    if (contrat) {
      return {
        message: ContratCRUDMessage.STATUS_SUCCESS,
        entity: contrat,
        status: 201,
      };
    }
    throw new NotFoundException(ContratCRUDMessage.STATUS_ERROR);
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
