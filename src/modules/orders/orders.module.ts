import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartsModule } from '../cart/carts.module';
import { DiscountsModule } from '../discounts/discounts.module';
import { InventoriesModule } from '../inventories/inventories.module';
import { ProductsModule } from '../products/products.module';
import { ShopsModule } from '../shops/shops.module';
import { UsersModule } from '../users/users.module';
import { OrdersControllerAdmin } from './orders.controller.admin';
import { OrdersControllerClient } from './orders.controller.client';
import { OrdersControllerSeller } from './orders.controller.seller';
import { OrdersRepository } from './orders.repository';
import { OrdersService } from './orders.service';
import { OrdersRedis } from './redis/orders.redis';
import { Order, OrderSchema } from './schemas/order.schema';

@Module({
  controllers: [OrdersControllerClient, OrdersControllerSeller, OrdersControllerAdmin],
  providers: [OrdersService, OrdersRepository, OrdersRedis],
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    CartsModule,
    ProductsModule,
    DiscountsModule,
    InventoriesModule,
    ShopsModule,
    UsersModule
  ]
})
export class OrdersModule { }
