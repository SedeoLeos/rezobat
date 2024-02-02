import { PaginationParams } from 'src/core/pagination/page-option.dto';
import {
  StatusContract,
  statusContractArray,
} from '../schemas/contract.schema';
import { IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class ContractPaginationParams extends PaginationParams {
  @IsOptional()
  @Type(() => String)
  @IsEnum(statusContractArray)
  status?: StatusContract;
}
