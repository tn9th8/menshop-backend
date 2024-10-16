import { Test, TestingModule } from '@nestjs/testing';
import { ProductsControllerClient } from './products.controller.client';
import { ProductsService } from './products.service';

describe('ProductsControllerClient', () => {
  let controller: ProductsControllerClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsControllerClient],
      providers: [ProductsService],
    }).compile();

    controller = module.get<ProductsControllerClient>(ProductsControllerClient);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
