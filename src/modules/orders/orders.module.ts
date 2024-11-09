import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersControllerClient } from './orders.controller.client';
import { OrdersControllerSeller } from './orders.controller.seller';
import { OrdersControllerAdmin } from './orders.controller.admin';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrdersRepository } from './orders.repository';
import { CheckoutService } from './services/checkout.service';
import { CartsModule } from '../cart/carts.module';
import { ProductsModule } from '../products/products.module';
import { DiscountsModule } from '../discounts/discounts.module';

@Module({
  controllers: [OrdersControllerClient, OrdersControllerSeller, OrdersControllerAdmin],
  providers: [OrdersService, OrdersRepository, CheckoutService],
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    CartsModule,
    ProductsModule,
    DiscountsModule,
  ]
})
export class OrdersModule { }
