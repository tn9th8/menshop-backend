import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateQuery } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Inventory, InventoryDoc, InventoryPartial } from './schemas/inventory.schema';

@Injectable()
export class InventoriesRepository {
  constructor(
    @InjectModel(Inventory.name)
    private readonly inventoryModel: SoftDeleteModel<InventoryDoc>
  ) { }

  //CREATE//
  async createOne(payload: Inventory) {
    const created = await this.inventoryModel.create(payload);
    return created;
  }

  //UPDATE//
  async updateOneByQuery(
    payload: UpdateQuery<InventoryPartial>, query: any
  ): Promise<InventoryDoc | null> {
    const updated = await this.inventoryModel.findOneAndUpdate(query, payload, { new: true }).lean();
    return updated || null;
  }

  //UPSERT//
  async upsertOneByQuery(
    payload: UpdateQuery<InventoryPartial>, query: any
  ): Promise<InventoryDoc | null> {
    const upserted = await this.inventoryModel.findOneAndUpdate(query, payload, { upsert: true, new: true }).lean();
    return upserted || null;
  }
}
