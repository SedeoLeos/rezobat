import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import {
  Contract,
  StatusContract,
  statusContractArray,
} from './contract.schema';
import { SchemaProp } from 'src/core/constants';

export type ContractStatusDocument = HydratedDocument<ContractStatus>;

@Schema(SchemaProp)
export class ContractStatus extends Document {
  @Prop({
    type: String,
    enum: statusContractArray,
    default: statusContractArray[0],
  })
  status: StatusContract;

  @Prop({
    type: Types.ObjectId,
  })
  contract: Contract | Types.ObjectId;
}

export const ContractStatusSchema =
  SchemaFactory.createForClass(ContractStatus);
