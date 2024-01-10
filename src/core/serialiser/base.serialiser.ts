import { Exclude } from 'class-transformer';

export class BaseEntity {
  @Exclude()
  _id: string;
  createdAt: string;
  updatedAt: string;
  @Exclude()
  __v: number;

  id: string;
  constructor(partial: Partial<any>) {
    partial.id = partial._id.valueOf();
    Object.assign(this, partial);
  }
}
