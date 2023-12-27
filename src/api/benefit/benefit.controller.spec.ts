import { Test, TestingModule } from '@nestjs/testing';
import { BenefitController } from './benefit.controller';
import { BenefitService } from './benefit.service';

describe('BenefitController', () => {
  let controller: BenefitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BenefitController],
      providers: [BenefitService],
    }).compile();

    controller = module.get<BenefitController>(BenefitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
