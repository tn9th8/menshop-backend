import { Module } from '@nestjs/common';
import { InventoriesService } from './inventories.service';
import { InventoriesControllerAdmin } from './inventories.controller.admin';
import { InventoriesRepository } from './inventories.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Inventory, InventorySchema } from './schemas/inventory.schema';
import { InventoriesControllerClient } from './inventories.controller.client';

@Module({
  controllers: [InventoriesControllerAdmin, InventoriesControllerClient],
  providers: [InventoriesService, InventoriesRepository],
  imports: [MongooseModule.forFeature([{ name: Inventory.name, schema: InventorySchema }])],
  exports: [InventoriesService, InventoriesRepository]
})
export class InventoriesModule { }
