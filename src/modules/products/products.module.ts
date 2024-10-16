import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsContext } from './factory/products.context';
import { ProductsFactory } from './factory/products.factory';
import { ProductsControllerAdmin } from './products.controller.admin';
import { ProductsControllerClient } from './products.controller.client';
import { ProductsRepository } from './products.repository';
import { ProductsService } from './products.service';
import { Product, ProductSchema } from './schemas/product.schema';
import { TopsService } from './types/tops/tops.service';
import { WatchesService } from './types/watches/watches.service';
import { CustomService } from './types/custom/custom.service';

@Module({
  controllers: [ProductsControllerAdmin, ProductsControllerClient],
  providers: [
    ProductsService,
    ProductsRepository,
    ProductsFactory,
    ProductsContext,
    CustomService,
    TopsService,
    WatchesService,
  ],
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])],
})
export class ProductsModule { }

