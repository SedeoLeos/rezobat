import { Controller, Post, Body, Get } from '@nestjs/common';
import { Abilitys } from 'src/core/decorators/public.decorator';
import { AbilitysEnum } from '../auth/tools/token.builder';
import { CurrentUser } from 'src/core/decorators/current-user.decorators';
import { User } from './schemas/user.schema';
import { UpdatePasswordDto } from '../auth/dto/otp.dto';
import { UploadUserimageDto } from './dto/upload-user.dto';
import { AccountService } from './account.service';

@Controller('acount')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Abilitys(AbilitysEnum.ACTIVE_USER)
  @Post('activate')
  create(@CurrentUser() user: User) {
    const { _id: id } = user;
    return this.accountService.update(id, { active: true });
  }

  @Get('profile')
  profile(@CurrentUser() user: User) {
    return user;
  }
  @Abilitys(AbilitysEnum.ACTIVE_USER, AbilitysEnum.DEFAULT_ABILITYS)
  @Post('update-password')
  updatePassword(
    @CurrentUser() user: User,
    @Body() payload: UpdatePasswordDto,
  ) {
    const { _id: id } = user;
    return this.accountService.updatePassword(id, payload.password);
  }
  @Post('upload-image')
  upload(@CurrentUser() user: User, @Body() payload: UploadUserimageDto) {
    return this.accountService.upload(user._id, payload);
  }
}
