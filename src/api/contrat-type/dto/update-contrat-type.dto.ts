import { PartialType } from '@nestjs/mapped-types';
import { CreateContratTypeDto } from './create-contrat-type.dto';

export class UpdateContratTypeDto extends PartialType(CreateContratTypeDto) {}
