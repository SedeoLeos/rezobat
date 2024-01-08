import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsUniqueMongoose } from 'src/core/decorators/unique.decorators';

export class RegisterDto {
  @IsOptional()
  @IsString()
  first_name: string;

  @IsOptional()
  @IsString()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  @IsUniqueMongoose('User', 'phone')
  phone: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @IsUniqueMongoose('User', 'email')
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
