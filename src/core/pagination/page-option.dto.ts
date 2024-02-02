// import { ApiPropertyOptional } from '@nestjs/swagger';
// import { Type } from 'class-transformer';
// import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

import {
  IsNumber,
  Min,
  IsOptional,
  MinLength,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
export class PaginationParams {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  skip?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;
}
export class PaginationParamsSearch {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  skip?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  @IsOptional()
  @Type(() => Array<string>)
  @MinLength(0)
  jobs?: string[];

  @IsOptional()
  @Type(() => String)
  @IsString()
  filter?: string;
}

export class UserPaginationParamsSearch {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  skip?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

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
