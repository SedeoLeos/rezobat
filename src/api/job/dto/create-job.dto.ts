import { IsNotEmpty, IsString } from 'class-validator';
import { IsFile, MemoryStoredFile } from 'nestjs-form-data';
import { IsUniqueMongoose } from 'src/core/decorators/unique.decorators';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  @IsUniqueMongoose('Job', 'name', { dbField: '_id', dtoField: 'id' })
  name: string;
  @IsString()
  description?: string;
  @IsFile()
  image: MemoryStoredFile;
}
