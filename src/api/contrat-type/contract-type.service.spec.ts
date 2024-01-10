import { Test, TestingModule } from '@nestjs/testing';
import { ContractTypeService } from './contract-type.service';

describe('ContractTypeService', () => {
  let service: ContractTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContractTypeService],
    }).compile();

    service = module.get<ContractTypeService>(ContractTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
