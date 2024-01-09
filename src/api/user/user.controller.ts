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
import { PaginationParams } from 'src/core/pagination/page-option.dto';
import { UserCRUDMessage } from './message/user.message';
import { Public } from 'src/core/decorators/public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
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

  @Public()
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
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
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
