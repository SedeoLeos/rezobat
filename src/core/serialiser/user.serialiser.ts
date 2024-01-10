import { Exclude } from 'class-transformer';
import { BaseEntity } from './base.serialiser';
import { MediaEntity } from './media.serialiser';
import { JobEntity } from './job.serialiser';

export class UserEntity extends BaseEntity {
  first_name: string;
  last_name: string;

  phone: string;

  email: string;
  @Exclude()
  password: string;
  role: string;
  active: boolean;
  isAdmin: boolean;
  jobs: JobEntity[];

  photo: MediaEntity;
}
