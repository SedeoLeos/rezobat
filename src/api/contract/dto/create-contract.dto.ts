import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsFiles, MemoryStoredFile } from 'nestjs-form-data';
import { IsExistMongoose } from 'src/core/decorators/exist.decorators';

export class CreateContractDto {
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

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  @IsExistMongoose('Job', '_id')
  job_id: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  @IsExistMongoose('ContratType', '_id')
  type_id: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  @IsExistMongoose('User', '_id')
  provider_id: string;

  @IsFiles()
  files: MemoryStoredFile[];
}
