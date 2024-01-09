import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ContrattypeDocument = HydratedDocument<ContratType>;
@Schema({ timestamps: true })
export class ContratType {
  @Prop()
  name: string;
  @Prop()
  description: string;
}
export const ContrattypeSchema = SchemaFactory.createForClass(ContratType);
