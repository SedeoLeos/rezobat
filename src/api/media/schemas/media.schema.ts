import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MediaDocument = HydratedDocument<Media>;
@Schema({ timestamps: true })
export class Media {
  @Prop()
  name: string;
  @Prop()
  url: string;
  @Prop()
  size: string;
  @Prop()
  content_type: string;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
