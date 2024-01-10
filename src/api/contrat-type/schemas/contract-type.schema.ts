import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SchemaProp } from 'src/core/constants';

export type ContracttypeDocument = HydratedDocument<ContractType>;
@Schema(SchemaProp)
export class ContractType {
  @Prop()
  name: string;
  @Prop()
  description: string;
}
export const ContracttypeSchema = SchemaFactory.createForClass(ContractType);
