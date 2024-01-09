import { Module } from '@nestjs/common';
import { ContratTypeService } from './contrat-type.service';
import { ContratTypeController } from './contrat-type.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ContratType, ContrattypeSchema } from './schemas/contrat-type.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ContratType.name, schema: ContrattypeSchema },
    ]),
  ],
  controllers: [ContratTypeController],
  providers: [ContratTypeService],
})
export class ContratTypeModule {}
