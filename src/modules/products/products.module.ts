import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsConfig } from './factory/products.config';
import { ProductsFactory } from './factory/products.factory';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product, ProductSchema } from './schemas/product.schema';
import { ClocksService } from './types/clocks/clocks.service';
import { ClothingsService } from './types/clothings/clothings.service';
import { Clock, ClockSchema } from './types/clocks/schema/clock.schema';
import { Clothing, ClothingSchema } from './types/clothings/schema/clothing.schema';
import { ProductsRepo } from './products.repo';
import { ClothingsRepo } from './types/clothings/clothings.repo';
import { ClocksRepo } from './types/clocks/clocks.repo';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductsRepo,
    ProductsFactory,
    ProductsConfig,
    ClothingsService,
    ClothingsRepo,
    ClocksService,
    ClocksRepo,
  ],
  imports: [MongooseModule.forFeature([
    { name: Product.name, schema: ProductSchema },
    { name: Clothing.name, schema: ClothingSchema },
    { name: Clock.name, schema: ClockSchema },
  ])],
})
export class ProductsModule { }

