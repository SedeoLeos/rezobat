import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
export class UpdateUserInfoDto extends PartialType(
  OmitType(CreateUserDto, ['role']),
) {}
