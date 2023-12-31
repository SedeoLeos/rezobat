import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as ShemaType } from 'mongoose';
import { User } from './../../../api/user/schemas/user.schema.js';
export type TokenDocument = HydratedDocument<Token>;
@Schema({ timestamps: true })
export class Token {
  @Prop()
  refreshToken: string;
  @Prop({ type: ShemaType.Types.ObjectId, ref: 'User' })
  user: User;
}
export const TokenSchema = SchemaFactory.createForClass(Token);
