import { Module } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { ShopsControllerAdmin } from './shops.controller.admin';
import { MongooseModule } from '@nestjs/mongoose';
import { Shop, ShopSchema } from './schemas/shop.schema';
import { ShopsRepository } from './shops.repository';
import { ShopsControllerClient } from './shops.controller.client';
import { CreateShopTransform } from './transform/create-shop.transform';
import { UsersModule } from '../users/users.module';
import { UsersRepository } from '../users/users.repository';
import { UpdateShopTransform } from './transform/update-shop.transform';

@Module({
  controllers: [
    ShopsControllerAdmin, ShopsControllerClient
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
