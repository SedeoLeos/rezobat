import { Media } from '../schemas/media.schema';
import { CreateMediaDto } from './create-media.dto';

export class UpdateMediaDto extends CreateMediaDto {
  old: Media;
}
