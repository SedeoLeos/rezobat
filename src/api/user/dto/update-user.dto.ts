import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  id: string;
}
export class UpdateUserInfoDto extends PartialType(
  OmitType(CreateUserDto, ['role', 'email']),
) {}
