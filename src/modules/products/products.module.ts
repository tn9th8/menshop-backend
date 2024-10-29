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
import { UsersModule } from '../users/users.module';
import { CreateProductTransform } from './transform/create-product.transform';
import { UpdatedProductTransform } from './transform/update-product.transform';
import { InventoriesModule } from '../inventories/inventories.module';

@Module({
  controllers: [
    ProductsControllerAdmin, ProductsControllerClient
  ],
  providers: [
    ProductsService, ProductsRepository,
    CreateProductTransform, UpdatedProductTransform
  ],
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    CategoriesModule,
    NeedsModule,
    ShopsModule,
    UsersModule,
    InventoriesModule
  ],
})
export class ProductsModule { }

