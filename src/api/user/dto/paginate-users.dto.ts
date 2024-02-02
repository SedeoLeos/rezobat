import { Type } from 'class-transformer';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { PaginationParams } from 'src/core/pagination/page-option.dto';

export class UserPaginationParams extends PaginationParams {
  @IsOptional()
  @Type(() => Array<string>)
  @MinLength(0)
  jobs?: string[];

  @IsOptional()
  @Type(() => String)
  @IsString()
  filter?: string;

  @IsOptional()
  @Type(() => String)
  @IsString()
  role?: string;
}
