import { Test, TestingModule } from '@nestjs/testing';
import { CartsControllerClient } from './carts.controller.client';
import { CartsService } from './carts.service';

describe('CartsControllerClient', () => {
  let controller: CartsControllerClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartsControllerClient],
      providers: [CartsService],
    }).compile();

    controller = module.get<CartsControllerClient>(CartsControllerClient);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
