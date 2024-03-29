import { PartialType, OmitType, PickType } from '@nestjs/mapped-types';
import {
  CreateContractAdminDto,
  CreateContractDto,
} from './create-contract.dto.js';
import { IsArray, IsIn, IsNotEmpty, IsString } from 'class-validator';
import {
  StatusContract,
  statusContractArray,
} from '../schemas/contract.schema.js';

export class UpdateContractDto extends PartialType(
  OmitType(CreateContractDto, ['files']),
) {}
export class UpdateContractAdminDto extends PartialType(
  OmitType(CreateContractAdminDto, ['files']),
) {}
export class UpdateContractStatusDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(statusContractArray)
  status: StatusContract;
}
export class AddFileContractDto extends PickType(CreateContractDto, [
  'files',
]) {}
export class RemoveContractDto {
  @IsArray()
  files_id: string[];
}
