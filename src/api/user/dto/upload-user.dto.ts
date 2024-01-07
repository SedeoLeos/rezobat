import { IsNotEmpty } from 'class-validator';
import { IsFile, MemoryStoredFile } from 'nestjs-form-data';

export class UploadUserimageDto {
  @IsFile()
  @IsNotEmpty()
  photo: MemoryStoredFile;
}
