import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type RoleDocument = HydratedDocument<Role>;
@Schema()
export class Role {}

export const RoleSchema = SchemaFactory.createForClass(Role);
