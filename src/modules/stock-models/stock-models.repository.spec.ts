import { Test, TestingModule } from '@nestjs/testing';
import { StockModelsService } from './stock-models.service';

describe('StockModelsService', () => {
  let service: StockModelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockModelsService],
    }).compile();

    service = module.get<StockModelsService>(StockModelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
