import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsUniqueMongoose } from 'src/core/decorators/unique.decorators';

export class CreateUserDto {
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
  role: 'Admin' | 'Provider';
}
