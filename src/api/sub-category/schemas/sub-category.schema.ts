import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as SchemaMongoose } from 'mongoose';
import { Category } from 'src/api/category/schema/category.schema';

export type SubCategoryDocument = HydratedDocument<SubCategory>;
@Schema({ timestamps: true })
export class SubCategory {
  @Prop()
  name: string;
  @Prop()
  description: string;
  @Prop({ type: SchemaMongoose.Types.ObjectId, ref: 'Category' })
  category: Category;
}
export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
