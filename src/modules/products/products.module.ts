import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsContext } from './factory/products.context';
import { ProductsFactory } from './factory/products.factory';
import { AdminProductsController } from './products.controller.admin';
import { ClientProductsController } from './products.controller.client';
import { ProductsRepo } from './products.repository';
import { ProductsService } from './products.service';
import { Product, ProductSchema } from './schemas/product.schema';
import { TopsService } from './types/tops/tops.service';
import { WatchesService } from './types/watches/watches.service';

@Module({
  controllers: [AdminProductsController, ClientProductsController],
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

