import { model, Schema } from 'mongoose';

export interface UserI {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password: string;
  role: string;
  isAdmin: boolean;
  // sub_category
  // category
  // photo
}

// @Prop()
//   first_name: string;
//   @Prop()
//   last_name: string;
//   @Prop({ required: true })
//   phone: string;
//   @Prop({ required: true })
//   email: string;
//   @Prop({ required: true })
//   password: string;
//   @Prop({ enum: ['Provider', 'Client', 'Admin'] })
//   role: string;
//   @Prop({ default: false })
//   isAdmin: boolean;
//   @Prop({ type: [{ type: SchemaType.Types.ObjectId, ref: 'SubCategory' }] })
//   sub_category: SubCategory[];
//   @Prop({ type: SchemaType.Types.ObjectId, ref: 'Category' })
//   category: Category;
//   @Prop({ type: SchemaType.Types.ObjectId, ref: 'Media' })
//   photo: Media;
export const userSchema = new Schema<UserI>({
  last_name: { type: String },
  first_name: { type: String },
  password: { type: String },
  email: { type: String },
  role: { type: String },
  isAdmin: { type: Boolean },
});

export const UserModel = model<UserI>('User', userSchema);
