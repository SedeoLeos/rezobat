import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Schema as SchemaMongoose } from 'mongoose';
import { Media } from 'src/api/media/schemas/media.schema';
import { SchemaProp } from 'src/core/constants';

export type JobDocument = HydratedDocument<Job>;
@Schema(SchemaProp)
export class Job extends Document {
  @Prop()
  name: string;
  @Prop()
  description: string;
  @Prop({ type: SchemaMongoose.Types.ObjectId, ref: 'Media' })
  image: Media;
}
export const JobSchema = SchemaFactory.createForClass(Job);

JobSchema.set('toJSON', {
  getters: true,
  virtuals: true,
  transform: function (doc, ret) {
    const item: Job = ret as Job;

    if (item.image?.url && !item.image.url.startsWith('http')) {
      item.image.url =
        process.env.NODE_ENV !== 'production'
          ? process.env.SERVER_URL + `/${item.image.url}`
          : process.env.SERVER_URL + `/${item.image.url}`;
    }

    return item;
  },
});
