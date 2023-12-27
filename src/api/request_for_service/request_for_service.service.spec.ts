import { Test, TestingModule } from '@nestjs/testing';
import { RequestForServiceService } from './request_for_service.service';

describe('RequestForServiceService', () => {
  let service: RequestForServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestForServiceService],
    }).compile();

    service = module.get<RequestForServiceService>(RequestForServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
