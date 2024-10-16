import { Test, TestingModule } from '@nestjs/testing';
import { ProductsControllerAdmin } from './products.controller.admin';
import { ProductsService } from './products.service';

describe('ProductsControllerAdmin', () => {
  let controller: ProductsControllerAdmin;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsControllerAdmin],
      providers: [ProductsService],
    }).compile();

    controller = module.get<ProductsControllerAdmin>(ProductsControllerAdmin);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
