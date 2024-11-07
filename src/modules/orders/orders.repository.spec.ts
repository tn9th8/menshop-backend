import { Test, TestingModule } from '@nestjs/testing';
import { OrdersRepository } from './orders.repository';

describe('OrdersRepository', () => {
  let service: OrdersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersRepository],
    }).compile();

    service = module.get<OrdersRepository>(OrdersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
