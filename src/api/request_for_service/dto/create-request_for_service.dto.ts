import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsFiles, MemoryStoredFile } from 'nestjs-form-data';

export class CreateRequestForServiceDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  category_id: string;
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  sub_category_id: string[];
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  phone: string;
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsOptional()
  description: string;
  @IsFiles()
  files: MemoryStoredFile[];
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  provider_id: string;
}
