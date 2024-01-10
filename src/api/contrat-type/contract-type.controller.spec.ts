import { Test, TestingModule } from '@nestjs/testing';
import { ContractTypeController } from './contract-type.controller';
import { ContractTypeService } from './contract-type.service';

describe('ContratTypeController', () => {
  let controller: ContractTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractTypeController],
      providers: [ContractTypeService],
    }).compile();

    controller = module.get<ContractTypeController>(ContractTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
