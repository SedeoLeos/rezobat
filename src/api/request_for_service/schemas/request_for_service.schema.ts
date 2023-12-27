import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RequestForServiceDocument = HydratedDocument<RequestForService>;
@Schema()
export class RequestForService {}

export const RequestForServiceSchema =
  SchemaFactory.createForClass(RequestForService);
