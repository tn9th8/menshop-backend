import { Test, TestingModule } from '@nestjs/testing';
import { CartDiscountController } from './cart-discount.controller';
import { CartDiscountService } from './cart-discount.service';

describe('CartDiscountController', () => {
  let controller: CartDiscountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartDiscountController],
      providers: [CartDiscountService],
    }).compile();

    controller = module.get<CartDiscountController>(CartDiscountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
