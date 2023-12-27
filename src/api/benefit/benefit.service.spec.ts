import { Test, TestingModule } from '@nestjs/testing';
import { BenefitService } from './benefit.service';

describe('BenefitService', () => {
  let service: BenefitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BenefitService],
    }).compile();

    service = module.get<BenefitService>(BenefitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
