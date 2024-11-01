import { Module } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { DiscountsControllerSeller } from './discounts.controller.seller';
import { DiscountsControllerClient } from './discounts.controller.client';
import { DiscountsRepository } from './discounts.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Discount, DiscountSchema } from './schemas/discount.schema';
import { ShopsModule } from '../shops/shops.module';
import { ProductsModule } from '../products/products.module';
import { DiscountsControllerAdmin } from './discounts.controller.admin';

@Module({
  controllers: [DiscountsControllerAdmin, DiscountsControllerSeller, DiscountsControllerClient],
  providers: [DiscountsService, DiscountsRepository],
  imports: [
    MongooseModule.forFeature([{ name: Discount.name, schema: DiscountSchema }]),
    ShopsModule,
    ProductsModule
  ],
})
export class DiscountsModule { }
