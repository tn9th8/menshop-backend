import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsControllerAdmin } from './carts.controller.admin';
import { CartsControllerClient } from './carts.controller.client';
import { CartsRepository } from './carts.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schemas/cart.schema';

@Module({
  controllers: [CartsControllerAdmin, CartsControllerClient],
  providers: [CartsService, CartsRepository],
  imports: [MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }])],
  exports: [CartsService, CartsRepository]
})
export class CartsModule { }
