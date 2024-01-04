import { PartialType } from '@nestjs/mapped-types';
import { CreateMediaDto } from './create-media.dto.js';

export class UpdateMediaDto extends PartialType(CreateMediaDto) {}
