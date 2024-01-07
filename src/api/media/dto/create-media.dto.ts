import { MemoryStoredFile } from 'nestjs-form-data';

export class CreateMediaDto {
  file: MemoryStoredFile;
  folder: string;
}
