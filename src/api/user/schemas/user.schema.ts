import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Schema as SchemaType } from 'mongoose';
import { Category } from 'src/api/category/schema/category.schema';
import { Media } from 'src/api/media/schemas/media.schema';
import { SubCategory } from 'src/api/sub-category/schemas/sub-category.schema';

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
  @Prop({ enum: ['Provider', 'Client', 'Admin'] })
  role: string;
  @Prop({ default: false })
  isAdmin: boolean;
  @Prop({ type: [{ type: SchemaType.Types.ObjectId, ref: 'SubCategory' }] })
  sub_category: SubCategory[];
  @Prop({ type: SchemaType.Types.ObjectId, ref: 'Category' })
  category: Category;
  @Prop({ type: SchemaType.Types.ObjectId, ref: 'Media' })
  photo: Media;
}

export const UserSchema = SchemaFactory.createForClass(User);
