import { Module } from '@nestjs/common';
import { ContractTypeService } from './contract-type.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ContractType,
  ContracttypeSchema,
} from './schemas/contract-type.schema';
import { AdminContractTypeController } from './contract-type.admin.controller';
import { ContractTypeController } from './contract-type.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ContractType.name, schema: ContracttypeSchema },
    ]),
  ],
  controllers: [AdminContractTypeController, ContractTypeController],
  providers: [ContractTypeService],
})
export class ContractTypeModule {}
