import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { Shop, ShopSchema } from './schemas/shop.schema';
import { ShopsControllerAdmin } from './shops.controller.admin';
import { ShopsControllerClient } from './shops.controller.client';
import { ShopsControllerSeller } from './shops.controller.seller';
import { ShopsRepository } from './shops.repository';
import { ShopsService } from './shops.service';
import { CreateShopTransform } from './transform/create-shop.transform';
import { UpdateShopTransform } from './transform/update-shop.transform';

@Module({
  controllers: [
    ShopsControllerAdmin, ShopsControllerSeller, ShopsControllerClient
  ],
  providers: [
    ShopsService, ShopsRepository,
    CreateShopTransform, UpdateShopTransform
  ],
  imports: [
    MongooseModule.forFeature([{ name: Shop.name, schema: ShopSchema }]),
    UsersModule
  ],
  exports: [
    ShopsService, ShopsRepository
  ]
})
export class ShopsModule { }
