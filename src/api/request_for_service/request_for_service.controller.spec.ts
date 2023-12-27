import { Test, TestingModule } from '@nestjs/testing';
import { RequestForServiceController } from './request_for_service.controller';
import { RequestForServiceService } from './request_for_service.service';

describe('RequestForServiceController', () => {
  let controller: RequestForServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestForServiceController],
      providers: [RequestForServiceService],
    }).compile();

    controller = module.get<RequestForServiceController>(RequestForServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
