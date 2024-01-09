import { Test, TestingModule } from '@nestjs/testing';
import { ContratTypeController } from './contrat-type.controller';
import { ContratTypeService } from './contrat-type.service';

describe('ContratTypeController', () => {
  let controller: ContratTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContratTypeController],
      providers: [ContratTypeService],
    }).compile();

    controller = module.get<ContratTypeController>(ContratTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
