import { Test, TestingModule } from '@nestjs/testing';
import { OrdersControllerAdmin } from './orders.controller.client';
import { OrdersService } from './orders.service';

describe('OrdersControllerAdmin', () => {
  let controller: OrdersControllerAdmin;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersControllerAdmin],
      providers: [OrdersService],
    }).compile();

    controller = module.get<OrdersControllerAdmin>(OrdersControllerAdmin);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
