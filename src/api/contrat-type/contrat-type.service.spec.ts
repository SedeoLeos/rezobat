import { Test, TestingModule } from '@nestjs/testing';
import { ContratTypeService } from './contrat-type.service';

describe('ContratTypeService', () => {
  let service: ContratTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContratTypeService],
    }).compile();

    service = module.get<ContratTypeService>(ContratTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
