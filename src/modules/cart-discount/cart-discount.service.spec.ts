import { Test, TestingModule } from '@nestjs/testing';
import { CartDiscountService } from './cart-discount.service';

describe('CartDiscountService', () => {
  let service: CartDiscountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartDiscountService],
    }).compile();

    service = module.get<CartDiscountService>(CartDiscountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
