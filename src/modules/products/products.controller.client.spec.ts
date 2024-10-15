import { Test, TestingModule } from '@nestjs/testing';
import { ClientProductsController } from './products.controller.client';
import { ProductsService } from './products.service';

describe('ClientProductsController', () => {
  let controller: ClientProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientProductsController],
      providers: [ProductsService],
    }).compile();

    controller = module.get<ClientProductsController>(ClientProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
