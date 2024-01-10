import { IsNotEmpty, IsString } from 'class-validator';
import { IsUniqueMongoose } from 'src/core/decorators/unique.decorators';

export class CreateContractTypeDto {
  @IsString()
  @IsNotEmpty()
  @IsUniqueMongoose('Job', 'name', { dbField: '_id', dtoField: 'id' })
  name: string;
  @IsString()
  description?: string;
}
