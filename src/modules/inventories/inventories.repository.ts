import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IInventory, Inventory } from './schemas/inventory.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CreateInventoryDto } from './dto/create-inventory.dto';

@Injectable()
export class InventoriesRepository {
  constructor(
    @InjectModel(Inventory.name)
    private readonly inventoryModel: SoftDeleteModel<IInventory>
  ) { }

  //CREATE//
  async createOne(payload: Inventory) {
    const created = await this.inventoryModel.create(payload);
    return created;
  }
  //END CREATE//
}
