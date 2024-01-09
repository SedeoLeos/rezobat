import { PartialType, OmitType, PickType } from '@nestjs/mapped-types';
import { CreateContractDto } from './create-contract.dto.js';
import { IsArray } from 'class-validator';

export class UpdateContractDto extends PartialType(
  OmitType(CreateContractDto, ['files']),
) {}
export class AddFileContractDto extends PickType(CreateContractDto, [
  'files',
]) {}
export class RemoveContractDto {
  @IsArray()
  files_id: string[];
}
