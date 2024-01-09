import { IsNotEmpty, IsString } from 'class-validator';
import { IsFile, MemoryStoredFile } from 'nestjs-form-data';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  description?: string;
  @IsFile()
  image: MemoryStoredFile;
}
