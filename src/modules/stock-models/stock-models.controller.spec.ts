import { Test, TestingModule } from '@nestjs/testing';
import { StockModelsController } from './stock-models.controller';
import { StockModelsService } from './stock-models.service';

describe('StockModelsController', () => {
  let controller: StockModelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockModelsController],
      providers: [StockModelsService],
    }).compile();

    controller = module.get<StockModelsController>(StockModelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
