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
import { ContratTypeService } from './contrat-type.service';
import { CreateContratTypeDto } from './dto/create-contrat-type.dto';
import { UpdateContratTypeDto } from './dto/update-contrat-type.dto';
import { ContratTypeCRUDMessage } from './message/contrat-type.message';
import { PaginationParams } from 'src/core/pagination/page-option.dto';

@Controller('contrat-type')
export class ContratTypeController {
  constructor(private readonly contratTypeService: ContratTypeService) {}

  @Post()
  async create(@Body() createContratTypeDto: CreateContratTypeDto) {
    const contratType =
      await this.contratTypeService.create(createContratTypeDto);
    if (contratType) {
      return {
        message: ContratTypeCRUDMessage.CREATE_SUCCESS,
        entity: contratType,
        status: 201,
      };
    }
    throw new BadRequestException(ContratTypeCRUDMessage.CREATE_ERROR);
  }

  @Get()
  findAll(@Query() { limit, skip }: PaginationParams) {
    return this.contratTypeService.findAll(skip, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const contratType = await this.contratTypeService.findOne(id);
    if (contratType) {
      return {
        message: ContratTypeCRUDMessage.READ_SUCCESS,
        entity: contratType,
        status: 200,
      };
    }
    throw new NotFoundException(ContratTypeCRUDMessage.READ_ERROR);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateContratTypeDto: UpdateContratTypeDto,
  ) {
    const contratType = await this.contratTypeService.update(
      id,
      updateContratTypeDto,
    );
    if (contratType) {
      return {
        message: ContratTypeCRUDMessage.UPDATE_SUCCESS,
        entity: contratType,
        status: 201,
      };
    }
    throw new NotFoundException(ContratTypeCRUDMessage.UPDATE_ERROR);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const contratType = await this.contratTypeService.remove(id);
    if (contratType) {
      return {
        message: ContratTypeCRUDMessage.DELETE_SUCCESS,
        entity: contratType,
        status: 201,
      };
    }
    throw new NotFoundException(ContratTypeCRUDMessage.DELETE_ERROR);
  }
}
