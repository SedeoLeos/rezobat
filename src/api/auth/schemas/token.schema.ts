import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as ShemaType } from 'mongoose';
import { User } from 'src/api/user/schemas/user.schema';
import { SchemaProp } from 'src/core/constants';
export type TokenDocument = HydratedDocument<Token>;
@Schema(SchemaProp)
export class Token {
  @Prop()
  refreshToken: string;
  @Prop({ type: ShemaType.Types.ObjectId, ref: 'User' })
  user: User;
}
export const TokenSchema = SchemaFactory.createForClass(Token);
