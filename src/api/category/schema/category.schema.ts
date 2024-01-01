import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as SchemaMongoose } from 'mongoose';
import { Media } from 'src/api/media/schemas/media.schema';
import { SubCategory } from 'src/api/sub-category/schemas/sub-category.schema';

export type CategoryDocument = HydratedDocument<Category>;
@Schema({ timestamps: true })
export class Category {
  @Prop()
  name: string;
  @Prop()
  description: string;
  @Prop({ type: SchemaMongoose.Types.ObjectId, ref: 'Media' })
  image: Media;
  @Prop({ type: [{ type: SchemaMongoose.Types.ObjectId, ref: 'SubCategory' }] })
  sub_category: SubCategory;
}
export const CategorySchema = SchemaFactory.createForClass(Category);
