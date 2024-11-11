import { Module } from '@nestjs/common';
import { InventoriesService } from './inventories.service';
import { InventoriesControllerAdmin } from './inventories.controller.admin';
import { InventoriesRepository } from './inventories.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Inventory, InventorySchema } from './schemas/inventory.schema';
import { InventoriesControllerSeller } from './inventories.controller.seller';
import { ProductsModule } from '../products/products.module';

@Module({
  controllers: [InventoriesControllerAdmin, InventoriesControllerSeller],
  providers: [InventoriesService, InventoriesRepository],
  imports: [MongooseModule.forFeature([{ name: Inventory.name, schema: InventorySchema }])],
  exports: [InventoriesService, InventoriesRepository]
})
export class InventoriesModule { }
