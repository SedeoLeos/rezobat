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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  PaginationParams,
  PaginationParamsSearch,
  UserPaginationParamsSearch,
} from 'src/core/pagination/page-option.dto';
import { UserCRUDMessage } from './message/user.message';
import { Abilitys } from 'src/core/decorators/public.decorator';
import { InjectPkToBody } from 'src/core/validator/decorators';
import { FormDataRequest } from 'nestjs-form-data';
import { AbilitysEnum } from '../auth/tools/token.builder';
@Abilitys(AbilitysEnum.ADMIN)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @FormDataRequest()
  async create(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    const user = await this.userService.create(createUserDto);
    if (user) {
      return {
        message: UserCRUDMessage.CREATE_SUCCESS,
        entity: user,
        status: 201,
      };
    }
    throw new BadRequestException(UserCRUDMessage.CREATE_ERROR);
  }
  @Get()
  findAll(@Query() { limit, skip }: PaginationParams) {
    return this.userService.findAll(skip, limit);
  }
  @Abilitys(AbilitysEnum.ARTISANT)
  @Abilitys(AbilitysEnum.CLIENT)
  @Get('search')
  findSearch(@Query() params: UserPaginationParamsSearch) {
    return this.userService.search(params);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    if (user) {
      return {
        message: UserCRUDMessage.READ_SUCCESS,
        entity: user,
        status: 201,
      };
    }
    throw new NotFoundException(UserCRUDMessage.READ_ERROR);
  }

  @Patch(':id')
  @InjectPkToBody({ dtoField: 'id', paramsName: 'id' })
  @FormDataRequest()
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    const user = await this.userService.update(id, updateUserDto);
    if (user) {
      return {
        message: UserCRUDMessage.UPDATE_SUCCESS,
        entity: user,
        status: 201,
      };
    }
    throw new BadRequestException(UserCRUDMessage.UPDATE_ERROR);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const user = await this.userService.remove(id);
    if (user) {
      return {
        message: UserCRUDMessage.DELETE_SUCCESS,
        entity: user,
        status: 201,
      };
    }
    throw new BadRequestException(UserCRUDMessage.DELETE_ERROR);
  }
}
