import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ClothingService } from './modules/clothing.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product, ProductSchema } from './schemas/product.schema';
import { Clothing, ClothingSchema } from './modules/schema/clothing.schema';
import { Clock, ClockSchema } from './modules/schema/clock.schema';
import { ClocksService } from './modules/clocks.service';
import { ProductsFactory } from './factory/products.factory';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Product.name, schema: ProductSchema },
    { name: Clothing.name, schema: ClothingSchema },
    { name: Clock.name, schema: ClockSchema },
  ])],
  controllers: [ProductsController],
  providers: [ProductsService, ClothingService, ClocksService, ProductsFactory],
})
export class ProductsModule { }
