import { Test, TestingModule } from '@nestjs/testing';
import { CathegorieController } from './cathegorie.controller';
import { CathegorieService } from './cathegorie.service';

describe('CathegorieController', () => {
  let controller: CathegorieController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CathegorieController],
      providers: [CathegorieService],
    }).compile();

    controller = module.get<CathegorieController>(CathegorieController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
