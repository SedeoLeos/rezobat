import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument, Schema as SchemaMongoose } from 'mongoose';
import { Category } from 'src/api/category/schema/category.schema';
import { Media } from 'src/api/media/schemas/media.schema';
import { SubCategory } from 'src/api/sub-category/schemas/sub-category.schema';
import { User } from 'src/api/user/schemas/user.schema';

export type RequestForServiceDocument = HydratedDocument<RequestForService>;
@Schema({ timestamps: true })
export class RequestForService {
  @Prop()
  name: string;
  @Prop()
  description: string;
  @Prop({ type: SchemaMongoose.Types.ObjectId, ref: 'User' })
  client: User;
  @Prop({ type: SchemaMongoose.Types.ObjectId, ref: 'User' })
  provider: User;
  @Prop({ type: SchemaMongoose.Types.ObjectId, ref: 'Category' })
  category: Category;
  @Prop({ type: SchemaMongoose.Types.ObjectId, ref: 'SubCategory' })
  sub_category: SubCategory;
  @Prop({ type: [{ type: SchemaMongoose.Types.ObjectId, ref: 'Media' }] })
  files: Media[];
}

export const RequestForServiceSchema =
  SchemaFactory.createForClass(RequestForService);