import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartsControllerAdmin } from './carts.controller.admin';
import { CartsControllerClient } from './carts.controller.client';
import { CartsRepository } from './carts.repository';
import { CartsService } from './carts.service';
import { Cart, CartSchema } from './schemas/cart.schema';
import { DiscountsModule } from '../discounts/discounts.module';

@Module({
  controllers: [CartsControllerAdmin, CartsControllerClient],
  providers: [CartsService, CartsRepository],
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }])
  ],
  exports: [CartsService, CartsRepository]
})
export class CartsModule { }
