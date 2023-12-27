import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Media } from 'src/api/media/schemas/media.schema';
import * as mongoose from 'mongoose';
export type CathegorieDocument = HydratedDocument<Cathegorie>;

@Schema()
export class Cathegorie {
  @Prop()
  name: string;

  @Prop({ type: mongoose.Schema.ObjectId, ref: 'Media' })
  media: Media;
}
export const CathegorieSchema = SchemaFactory.createForClass(Cathegorie);
