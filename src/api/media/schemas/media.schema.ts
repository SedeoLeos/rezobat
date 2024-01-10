import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';
import { SchemaProp } from 'src/core/constants';

export type MediaDocument = HydratedDocument<Media>;
@Schema(SchemaProp)
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
