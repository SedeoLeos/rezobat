import { IsString } from 'class-validator';
import { IsFile, MemoryStoredFile } from 'nestjs-form-data';

export class CreateCategoryDto {
  @IsString()
  name: string;
  @IsString()
  description?: string;
  @IsFile()
  image: MemoryStoredFile;
}
