import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsContext } from './factory/products.context';
import { ProductsFactory } from './factory/products.factory';
import { ProductsController } from './products.controller';
import { ProductsRepo } from './products.repo';
import { ProductsService } from './products.service';
import { Product, ProductSchema } from './schemas/product.schema';
import { WatchesService } from './types/watches/watches.service';
import { TopsService } from './types/tops/tops.service';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductsRepo,
    ProductsFactory,
    ProductsContext,
    TopsService,
    WatchesService,
  ],
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])],
})
export class ProductsModule { }

