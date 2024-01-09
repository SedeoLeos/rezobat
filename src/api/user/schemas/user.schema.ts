import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Schema as SchemaType } from 'mongoose';

import { Job } from 'src/api/job/schema/job.schema';
import { Media } from 'src/api/media/schemas/media.schema';

export type UserDocument = HydratedDocument<User>;
@Schema({ timestamps: true })
export class User extends Document {
  @Prop()
  first_name: string;
  @Prop()
  last_name: string;
  @Prop({ required: true })
  phone: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ enum: ['Provider', 'Client', 'Admin'], default: 'Client' })
  role: string;
  @Prop({ default: false })
  active: boolean;
  @Prop({ default: false })
  isAdmin: boolean;
  @Prop({ type: [{ type: SchemaType.Types.ObjectId, ref: 'Job' }] })
  jobs: Job[];
  @Prop({ type: SchemaType.Types.ObjectId, ref: 'Media' })
  photo: Media;
}

export const UserSchema = SchemaFactory.createForClass(User);
