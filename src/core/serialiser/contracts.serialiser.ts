import { StatusContract } from 'src/api/contract/schemas/contract.schema';
import { BaseEntity } from './base.serialiser';
import { ContractTypeEntity } from './contract-type.serialiser';
import { JobEntity } from './job.serialiser';
import { MediaEntity } from './media.serialiser';
import { UserEntity } from './user.serialiser';

export class ContractEntity extends BaseEntity {
  name: string;

  description: string;
  client: UserEntity;

  provider: UserEntity;
  job: JobEntity;

  type: ContractTypeEntity;

  files: MediaEntity[];

  phone: string;

  email: string;

  status: StatusContract;
}
