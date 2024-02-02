import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import {
  OTPPasswordDTO,
  OTPRefreshDTO,
  OTPVerifyDto,
  ResetPasswordDto,
} from './dto/otp.dto';
import {
  Abilitys,
  Public,
  Refresh,
} from 'src/core/decorators/public.decorator';
import { AbilitysEnum, TokenI } from './tools/token.builder.js';
import { CurrentUser } from 'src/core/decorators/current-user.decorators';
import { User } from '../user/schemas/user.schema';
import { AccountCRUDMessage } from '../user/message/account.messga';
import { extractTokenFromHeader } from './guard/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-in')
  signIn(@Body() payload: LoginDto) {
    return this.authService.signIn(payload);
  }
  @Public()
  @Post('sign-up')
  signUp(@Body() payload: RegisterDto) {
    return this.authService.signUp(payload);
  }
  @Refresh()
  @Post('refresh')
  refreshToken(@Headers('tokenId') tokenId: string, @Request() request: any) {
    const { user, abilitys } = request;
    const playload: TokenI<User> = {
      user,
      abilitys,
    };
    return this.authService.getUserIfRefreshTokenMatches(
      extractTokenFromHeader(request),
      tokenId,
      playload,
    );
  }

  // Otp login
  @Abilitys(AbilitysEnum.VERIFIED_OTP)
  @Post('verify-otp')
  otpVerify(@Body() playload: OTPVerifyDto) {
    return this.authService.otpVerify(playload);
  }

  @Abilitys(AbilitysEnum.UPDATE_PASSWORD)
  @Post('reset-password')
  async resetPassword(
    @CurrentUser() user: User,
    @Body() payload: ResetPasswordDto,
  ) {
    const _user = await this.authService.resetPassword(user, payload.password);
    if (_user) {
      return {
        message: AccountCRUDMessage.PASSWORD_SUCCESS,
        entity: _user,
        status: 200,
      };
    }
    throw new BadRequestException(AccountCRUDMessage.PASSWORD_ERROR);
  }
  @Public()
  @Post('forget-password')
  otpPassword(@Body() playload: OTPPasswordDTO) {
    return this.authService.otpPassword(playload);
  }
  @Public()
  @Post('refresh-otp')
  optRefresh(@Body() playload: OTPRefreshDTO) {
    return this.authService.otpRefresh(playload);
  }
}
