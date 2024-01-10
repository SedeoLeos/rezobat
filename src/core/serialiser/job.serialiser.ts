import { Expose, Type } from 'class-transformer';
import { BaseEntity } from './base.serialiser';
import { MediaEntity } from './media.serialiser';

export class JobEntity extends BaseEntity {
  name: string;
  description: string;
  @Expose()
  @Type(() => MediaEntity)
  image: MediaEntity;
}
