import { Module } from '@nestjs/common';
import { CartDiscountService } from './cart-discount.service';
import { CartDiscountController } from './cart-discount.controller';
import { CartsModule } from '../cart/carts.module';
import { DiscountsModule } from '../discounts/discounts.module';

@Module({
  controllers: [CartDiscountController],
  providers: [CartDiscountService],
  imports: [CartsModule, DiscountsModule]
})
export class CartDiscountModule { }
