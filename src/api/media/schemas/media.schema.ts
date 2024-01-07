import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';

export type MediaDocument = HydratedDocument<Media>;
@Schema({ timestamps: true })
export class Media extends Document {
  @Prop()
  name: string;
  @Prop()
  url: string;
  @Prop()
  size: string;
  @Prop()
  mimetype: string;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
