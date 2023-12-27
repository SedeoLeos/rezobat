import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Media } from 'src/api/media/schemas/media.schema';
import * as mongoose from 'mongoose';
export type BenefitDocument = HydratedDocument<Benefit>;

@Schema()
export class Benefit {
  @Prop()
  name: string;

  @Prop({ type: mongoose.Schema.ObjectId, ref: 'Media' })
  media: Media;
}

export const BenefitSchema = SchemaFactory.createForClass(Benefit);
