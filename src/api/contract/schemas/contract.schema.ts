import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document, HydratedDocument, Schema as SchemaMongoose } from 'mongoose';
import { ContratType } from 'src/api/contrat-type/schemas/contrat-type.schema';
import { Job } from 'src/api/job/schema/job.schema';
import { Media } from 'src/api/media/schemas/media.schema';
import { User } from 'src/api/user/schemas/user.schema';
export type StatusContract =
  | 'En attends de traitement'
  | 'En Cours'
  | 'Terminer'
  | 'Annuler';
export type ContractDocument = HydratedDocument<Contract>;
@Schema({ timestamps: true })
export class Contract extends Document {
  @Prop()
  name: string;
  @Prop()
  description: string;
  @Prop({ type: SchemaMongoose.Types.ObjectId, ref: 'User' })
  client: User;
  @Prop({ type: SchemaMongoose.Types.ObjectId, ref: 'User' })
  provider: User;
  @Prop({ type: SchemaMongoose.Types.ObjectId, ref: 'Job' })
  job: Job;
  @Prop({ type: SchemaMongoose.Types.ObjectId, ref: 'ContratType' })
  type: ContratType;
  @Prop({ type: [{ type: SchemaMongoose.Types.ObjectId, ref: 'Media' }] })
  files: Media[];
  @Prop()
  phone: string;
  @Prop()
  email: string;
  @Prop({
    enum: ['En attends de traitement', 'En Cours', 'Terminer', 'Annuler'],
    default: 'En attends de traitement',
  })
  status: StatusContract;
}

export const ContractSchema = SchemaFactory.createForClass(Contract);
