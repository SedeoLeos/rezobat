import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Contract, ContractSchema } from './schemas/contract.schema';
import { ContractAdminController } from './contract-admin.controller';
import { ContractAdminService } from './contract-admin.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Contract.name, schema: ContractSchema },
    ]),
  ],
  controllers: [ContractController, ContractAdminController],
  providers: [ContractService, ContractAdminService],
})
export class ContractModule {}
