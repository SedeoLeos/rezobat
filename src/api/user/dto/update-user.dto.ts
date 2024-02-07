import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsNotEmpty()
  id: string;
}
export class UpdateUserInfoDto extends PartialType(
  OmitType(CreateUserDto, ['role', 'email', 'jobs', 'photo']),
) {}
