import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MediaDocument = HydratedDocument<Media>;
@Schema()
export class Media {
  @Prop()
  name: string;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
