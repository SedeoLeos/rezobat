import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { Abilitys } from 'src/core/decorators/public.decorator';
import { AbilitysEnum } from '../auth/tools/token.builder';
import { CurrentUser } from 'src/core/decorators/current-user.decorators';
import { User } from './schemas/user.schema';
import { UpdatePasswordDto } from '../auth/dto/otp.dto';
import { UploadUserimageDto } from './dto/upload-user.dto';
import { AccountService } from './account.service';
import { UpdateUserInfoDto } from './dto/update-user.dto';
import { AccountCRUDMessage } from './message/account.messga';
import { AddJob, RemoveJob } from './dto/accountJob.dto';

@Controller('acount')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Abilitys(AbilitysEnum.ACTIVE_USER)
  @Post('activate')
  async create(@CurrentUser() user: User) {
    const _user = await this.accountService.activeCompte(user);
    if (_user) {
      return {
        message: AccountCRUDMessage.ACTIVATE_SUCCESS,
        entity: _user,
        status: 201,
      };
    }
    throw new BadRequestException(AccountCRUDMessage.ACTIVATE_ERROR);
  }

  @Get('profile')
  profile(@CurrentUser() user: User) {
    return user;
  }
  @Abilitys(AbilitysEnum.ACTIVE_USER, AbilitysEnum.DEFAULT_ABILITYS)
  @Post('update-password')
  async updatePassword(
    @CurrentUser() user: User,
    @Body() payload: UpdatePasswordDto,
  ) {
    const { _id: id } = user;
    const _user = await this.accountService.updatePassword(
      id,
      payload.password,
    );
    if (_user) {
      return {
        message: AccountCRUDMessage.PASSWORD_SUCCESS,
        entity: _user,
        status: 201,
      };
    }
    throw new BadRequestException(AccountCRUDMessage.PASSWORD_ERROR);
  }
  @Abilitys(AbilitysEnum.ACTIVE_USER, AbilitysEnum.DEFAULT_ABILITYS)
  @Patch()
  async update(@CurrentUser() user: User, @Body() payload: UpdateUserInfoDto) {
    const { _id: id } = user;
    const _user = await this.accountService.updateInfo(id, payload);
    if (_user) {
      return {
        message: AccountCRUDMessage.UPDATE_SUCCESS,
        entity: _user,
        status: 201,
      };
    }
    throw new BadRequestException(AccountCRUDMessage.UPDATE_ERROR);
  }
  @Post('upload-image')
  async upload(@CurrentUser() user: User, @Body() payload: UploadUserimageDto) {
    const _user = await this.accountService.upload(user._id, payload);
    if (_user) {
      return {
        message: AccountCRUDMessage.UPLOAD_SUCCESS,
        entity: _user,
        status: 201,
      };
    }
    throw new BadRequestException(AccountCRUDMessage.UPLOAD_ERROR);
  }
  @Post('add-job')
  async addJob(@CurrentUser() cuser: User, @Body() payload: AddJob) {
    const user = await this.accountService.addJob(cuser._id, payload);
    if (user) {
      return {
        message: AccountCRUDMessage.ADD_WORK_SUCCESS,
        entity: user,
        status: 201,
      };
    }
    throw new BadRequestException(AccountCRUDMessage.ADD_WORK_ERROR);
  }
  @Post('remove-job')
  async removeJob(@CurrentUser() cuser: User, @Body() payload: RemoveJob) {
    const user = await this.accountService.removeJob(cuser._id, payload);
    if (user) {
      return {
        message: AccountCRUDMessage.REMOVE_WORK_SUCCESS,
        entity: user,
        status: 201,
      };
    }
    throw new BadRequestException(AccountCRUDMessage.REMOVE_WORK_ERROR);
  }
  @Delete()
  async remove(@CurrentUser() user: User) {
    const _user = await this.accountService.remove(user._id);
    if (_user) {
      return {
        message: AccountCRUDMessage.DELETE_SUCCESS,
        entity: _user,
        status: 201,
      };
    }
    throw new BadRequestException(AccountCRUDMessage.DELETE_ERROR);
  }
}
