import { BaseEntity } from './base.serialiser';

export class MediaEntity extends BaseEntity {
  name: string;

  url: string;

  size: string;

  mimetype: string;
}
