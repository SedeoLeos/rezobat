import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as ShemaMongoose } from 'mongoose';
import { User } from 'src/api/user/schemas/user.schema';
import { SchemaProp } from 'src/core/constants';
export type OTPDocument = HydratedDocument<OTP>;
@Schema(SchemaProp)
export class OTP {
  @Prop()
  value: string;
  @Prop()
  email: string;
  @Prop()
  expire: Date;
  @Prop()
  rec_limiter: Date;
  @Prop({ type: ShemaMongoose.Types.Boolean })
  is_first_auth: boolean;
  @Prop({ type: ShemaMongoose.Types.Boolean })
  is_forget_password: boolean;
  @Prop({ type: ShemaMongoose.Types.ObjectId, ref: 'User' })
  user: User;
}
export const OTPSchema = SchemaFactory.createForClass(OTP);
