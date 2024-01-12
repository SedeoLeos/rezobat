import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { IsFile, MemoryStoredFile } from 'nestjs-form-data';
import { IsUniqueMongoose } from 'src/core/decorators/unique.decorators';
import { RoleEnum } from '../schemas/user.schema';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  first_name: string;

  @IsOptional()
  @IsString()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  @IsUniqueMongoose('User', 'phone', { dbField: '_id', dtoField: 'id' })
  phone: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @IsUniqueMongoose('User', 'email', { dbField: '_id', dtoField: 'id' })
  email: string;
  @IsString()
  @IsNotEmpty()
  role: RoleEnum;

  @IsFile()
  @IsOptional()
  photo?: MemoryStoredFile;
  @ValidateIf((dto: CreateUserDto) => dto.role == 'Provider')
  @IsOptional()
  @IsArray()
  @Type(() => Array)
  jobs: string[];
}
