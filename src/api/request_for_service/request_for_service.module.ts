import { Module } from '@nestjs/common';
import { RequestForServiceService } from './request_for_service.service';
import { RequestForServiceController } from './request_for_service.controller';

@Module({
  controllers: [RequestForServiceController],
  providers: [RequestForServiceService],
})
export class RequestForServiceModule {}
