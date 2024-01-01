import { Module } from '@nestjs/common';
import { RequestForServiceService } from './request_for_service.service';
import { RequestForServiceController } from './request_for_service.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RequestForService,
  RequestForServiceSchema,
} from './schemas/request_for_service.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RequestForService.name, schema: RequestForServiceSchema },
    ]),
  ],
  controllers: [RequestForServiceController],
  providers: [RequestForServiceService],
})
export class RequestForServiceModule {}
