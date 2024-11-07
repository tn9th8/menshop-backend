import { Test, TestingModule } from '@nestjs/testing';
import { OrdersControllerClient } from './orders.controller.client';
import { OrdersService } from './orders.service';

describe('OrdersControllerClient', () => {
  let controller: OrdersControllerClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersControllerClient],
      providers: [OrdersService],
    }).compile();

    controller = module.get<OrdersControllerClient>(OrdersControllerClient);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
