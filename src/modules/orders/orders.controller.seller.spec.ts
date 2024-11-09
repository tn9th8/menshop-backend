import { Test, TestingModule } from '@nestjs/testing';
import { OrdersControllerSeller } from './orders.controller.seller';
import { OrdersService } from './orders.service';

describe('OrdersControllerSeller', () => {
  let controller: OrdersControllerSeller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersControllerSeller],
      providers: [OrdersService],
    }).compile();

    controller = module.get<OrdersControllerSeller>(OrdersControllerSeller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
