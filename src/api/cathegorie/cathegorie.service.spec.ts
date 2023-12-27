import { Test, TestingModule } from '@nestjs/testing';
import { CathegorieService } from './cathegorie.service';

describe('CathegorieService', () => {
  let service: CathegorieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CathegorieService],
    }).compile();

    service = module.get<CathegorieService>(CathegorieService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
