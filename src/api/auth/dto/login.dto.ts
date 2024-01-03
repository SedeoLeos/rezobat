import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString({ message: '' })
  @IsNotEmpty({ message: '' })
  @IsEmail({}, { message: '' })
  email: string;
  @IsString({ message: '' })
  @IsNotEmpty({ message: '' })
  password: string;
}
