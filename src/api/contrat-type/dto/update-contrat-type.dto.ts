import { PartialType } from '@nestjs/mapped-types';
import { CreateContractTypeDto } from './create-contrat-type.dto';

export class UpdateContractTypeDto extends PartialType(CreateContractTypeDto) {
  id: string;
}
