import { Module } from '@nestjs/common';
import { ContractTypeService } from './contract-type.service';
import { AdminContractTypeController } from './contract-type.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ContractType,
  ContracttypeSchema,
} from './schemas/contract-type.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ContractType.name, schema: ContracttypeSchema },
    ]),
  ],
  controllers: [AdminContractTypeController],
  providers: [ContractTypeService],
})
export class ContractTypeModule {}
