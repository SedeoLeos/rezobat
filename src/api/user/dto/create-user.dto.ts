import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsFile, MemoryStoredFile } from 'nestjs-form-data';
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
  @IsUniqueMongoose('User', 'phone', { dbField: '_id', dtoField: 'id' })
  phone: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @IsUniqueMongoose('User', 'email', { dbField: '_id', dtoField: 'id' })
  email: string;
  @IsString()
  @IsNotEmpty()
  role: 'Admin' | 'Provider' | 'Client';

  @IsFile()
  photo: MemoryStoredFile;
}
