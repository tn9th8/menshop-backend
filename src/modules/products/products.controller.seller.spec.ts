import { Test, TestingModule } from '@nestjs/testing';
import { ProductsControllerSeller } from './products.controller.seller';
import { ProductsService } from './products.service';

describe('ProductsControllerSeller', () => {
  let controller: ProductsControllerSeller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsControllerSeller],
      providers: [ProductsService],
    }).compile();

    controller = module.get<ProductsControllerSeller>(ProductsControllerSeller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
