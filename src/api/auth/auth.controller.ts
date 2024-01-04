import { Controller, Headers, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { OTPRefreshDTO, OTPVerifyDto } from './dto/otp.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  signIn(payload: LoginDto) {
    return this.authService.signIn(payload);
  }
  @Post('sign-up')
  signUp(payload: RegisterDto) {
    return this.authService.signIn(payload);
  }
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
  otpVerify(playload: OTPVerifyDto) {
    return this.authService.otpVerify(playload);
  }
  optRefresh(playload: OTPRefreshDTO) {
    return this.authService.otpRefresh(playload);
  }
  // Forget password @email => renvoie le mail à utilisateur aprés trois essais en lui demande de revenir prochainement
  // forgetResetPassword(playload: UpdatePasswordDto) {
  // return this.authService.updatePass(playload);
  // }
}
