import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { otpType } from './otp.dto';

export class ResetPasswordDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumberString()
  @IsNotEmpty()
  otp: string;

  @IsEnum(['is_first_auth', 'is_forget_password'])
  @IsNotEmpty()
  type: otpType;

  @IsString()
  @IsNotEmpty()
  password: string;
}
