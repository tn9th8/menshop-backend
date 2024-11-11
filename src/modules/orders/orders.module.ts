import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartsModule } from '../cart/carts.module';
import { DiscountsModule } from '../discounts/discounts.module';
import { ProductsModule } from '../products/products.module';
import { OrdersControllerAdmin } from './orders.controller.admin';
import { OrdersControllerClient } from './orders.controller.client';
import { OrdersControllerSeller } from './orders.controller.seller';
import { OrdersRepository } from './orders.repository';
import { OrdersService } from './orders.service';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrdersRedis } from './redis/orders.redis';
import { InventoriesModule } from '../inventories/inventories.module';
import { createClient } from "redis";

@Module({
  controllers: [OrdersControllerClient, OrdersControllerSeller, OrdersControllerAdmin],
  providers: [OrdersService, OrdersRepository, OrdersRedis,
    // {
    //   provide: 'REDIS_OPTIONS',
    //   useValue: {
    //     url: 'redis://localhost:6379'
    //   }
    // },
    // {
    //   inject: ['REDIS_OPTIONS'],
    //   provide: 'REDIS_CLIENT',
    //   useFactory: async (options: { url: string }) => {
    //     const client = createClient(options);
    //     await client.connect();
    //     return client;
    //   }
    // }
  ],
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    CartsModule,
    ProductsModule,
    DiscountsModule,
    InventoriesModule
  ]
})
export class OrdersModule { }
