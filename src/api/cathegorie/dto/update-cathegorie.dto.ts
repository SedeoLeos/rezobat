import { PartialType } from '@nestjs/mapped-types';
import { CreateCathegorieDto } from './create-cathegorie.dto';

export class UpdateCathegorieDto extends PartialType(CreateCathegorieDto) {}
