import { PartialType } from '@nestjs/mapped-types';
import { CreateRequestForServiceDto } from './create-request_for_service.dto';

export class UpdateRequestForServiceDto extends PartialType(CreateRequestForServiceDto) {}
