import { Module } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { ShopsController } from './shops.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Shop, ShopSchema } from './schemas/shop.schema';
import { ShopsRepo } from './shops.repo';

@Module({
  controllers: [ShopsController],
  providers: [ShopsService, ShopsRepo],
  imports: [MongooseModule.forFeature([{ name: Shop.name, schema: ShopSchema }])],
  exports: [ShopsRepo]
})
export class ShopsModule { }
