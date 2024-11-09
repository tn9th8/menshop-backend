import { Test, TestingModule } from '@nestjs/testing';
import { CartsControllerAdmin } from './carts.controller.admin';
import { CartsService } from './carts.service';

describe('CartsControllerAdmin', () => {
  let controller: CartsControllerAdmin;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartsControllerAdmin],
      providers: [CartsService],
    }).compile();

    controller = module.get<CartsControllerAdmin>(CartsControllerAdmin);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
