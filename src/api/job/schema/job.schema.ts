import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Schema as SchemaMongoose } from 'mongoose';
import { Media } from 'src/api/media/schemas/media.schema';

export type JobDocument = HydratedDocument<Job>;
@Schema({ timestamps: true })
export class Job extends Document {
  @Prop()
  name: string;
  @Prop()
  description: string;
  @Prop({ type: SchemaMongoose.Types.ObjectId, ref: 'Media' })
  image: Media;
}
export const JobSchema = SchemaFactory.createForClass(Job);
