import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateQuery } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Inventory, InventoryDoc, InventoryPartial } from './schemas/inventory.schema';
import { toDbSelect } from 'src/common/utils/mongo.util';

@Injectable()
export class InventoriesRepository {
  constructor(
    @InjectModel(Inventory.name)
    private readonly inventoryModel: SoftDeleteModel<InventoryDoc>
  ) { }

  //CREATE//
  async createOne(payload: Inventory): Promise<InventoryDoc | null> {
    try {
      const { _doc: created } = await this.inventoryModel.create(payload);
      return created;
    } catch (error) {
      console.log('>>> Exception: InventoriesRepository: createOne: ' + error);
      return null;
    }
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

  //QUERY//
  async findOneByQueryRaw(
    query: any, select: string[] = [] //ko truyen select => select all
  ): Promise<InventoryDoc | null> {
    const found = await this.inventoryModel.findOne(query)
      .select(toDbSelect(select))
      .lean();
    return found || null;
  }
}
