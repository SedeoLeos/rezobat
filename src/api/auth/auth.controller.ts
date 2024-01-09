import { Body, Controller, Headers, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { OTPPasswordDTO, OTPRefreshDTO, OTPVerifyDto } from './dto/otp.dto';
import {
  Abilitys,
  Public,
  Refresh,
} from 'src/core/decorators/public.decorator';
import { AbilitysEnum } from './tools/token.builder.js';

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
  refreshToken(
    @Headers('authorisation') refreshToken: string,
    @Headers('tokenId') tokenId: string,
    @Request() request: any,
  ) {
    const { user } = request;
    return this.authService.getUserIfRefreshTokenMatches(
      refreshToken,
      tokenId,
      user,
    );
  }

  // Otp login
  @Abilitys(AbilitysEnum.VERIFIED_OTP)
  @Post('verify-otp')
  otpVerify(@Body() playload: OTPVerifyDto) {
    return this.authService.otpVerify(playload);
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
