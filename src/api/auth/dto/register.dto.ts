import { IsOptional, IsString } from 'class-validator';

export class Register {
  @IsOptional()
  @IsString()
  first_name: string;

  @IsOptional()
  @IsString()
  last_name: string;

  @IsString()
  phone: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
}
