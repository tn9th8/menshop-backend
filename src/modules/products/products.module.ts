import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsControllerAdmin } from './products.controller.admin';
import { ProductsControllerClient } from './products.controller.client';
import { ProductsRepository } from './products.repository';
import { ProductsService } from './products.service';
import { Product, ProductSchema } from './schemas/product.schema';
import { CategoriesModule } from '../categories/categories.module';
import { NeedsModule } from '../needs/needs.module';
import { ShopsModule } from '../shops/shops.module';

@Module({
  controllers: [ProductsControllerAdmin, ProductsControllerClient],
  providers: [ProductsService, ProductsRepository],
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    CategoriesModule,
    NeedsModule,
    ShopsModule
  ],
})
export class ProductsModule { }

