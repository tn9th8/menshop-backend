import { Test, TestingModule } from '@nestjs/testing';
import { ProductsRepo } from './products.repository';

describe('ProductsRepo', () => {
  let service: ProductsRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsRepo],
    }).compile();

    service = module.get<ProductsRepo>(ProductsRepo);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
