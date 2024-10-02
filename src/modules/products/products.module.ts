import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsConfig } from './factory/products.config';
import { ProductsFactory } from './factory/products.factory';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product, ProductSchema } from './schemas/product.schema';
import { ClocksService } from './types/clocks.service';
import { ClothingsService } from './types/clothings.service';
import { Clock, ClockSchema } from './types/schema/clock.schema';
import { Clothing, ClothingSchema } from './types/schema/clothing.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Product.name, schema: ProductSchema },
    { name: Clothing.name, schema: ClothingSchema },
    { name: Clock.name, schema: ClockSchema },
  ])],
  controllers: [ProductsController],
  providers: [
    ProductsConfig,
    ProductsFactory,
    ProductsService,
    ClothingsService,
    ClocksService
  ],
})
export class ProductsModule { }

