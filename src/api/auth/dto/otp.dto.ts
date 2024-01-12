import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsString,
} from 'class-validator';

export type otpType = 'is_first_auth' | 'is_forget_password';
export class OTPVerifyDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNumberString()
  @IsNotEmpty()
  otp: string;
  @IsEnum(['is_first_auth', 'is_forget_password'])
  @IsNotEmpty()
  type: otpType;
}
export class OTPRefreshDTO {
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsEnum(['is_first_auth', 'is_forget_password'])
  @IsNotEmpty()
  type: otpType;
}
export class OTPPasswordDTO {
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsEnum(['is_first_auth', 'is_forget_password'])
  @IsNotEmpty()
  type: otpType = 'is_forget_password';
}
export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsString()
  @IsNotEmpty()
  cpassword: string;
  @IsString()
  @IsNotEmpty()
  oldpassword: string;
}
export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}
