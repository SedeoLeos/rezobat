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
  @IsExistMongoose('Job', '_id', {
    message: 'Le champ job_id dois exister dans la base de donné',
  })
  job_id: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  @IsExistMongoose('ContractType', '_id', {
    message: 'Le champ type_id dois exister dans la base de donné',
  })
  type_id: string;

  @IsOptional()
  @IsString()
  @IsMongoId()
  @IsExistMongoose('User', '_id')
  provider_id?: string;

  @IsFiles()
  @IsOptional()
  files: MemoryStoredFile[];
}
export class CreateContractAdminDto extends CreateContractDto {
  @IsOptional()
  @IsString()
  @IsMongoId()
  @IsExistMongoose('User', '_id')
  client_id: string;
}
