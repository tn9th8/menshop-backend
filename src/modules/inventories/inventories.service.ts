import { BadRequestException, Injectable } from '@nestjs/common';
import { IKey } from 'src/common/interfaces/index.interface';
import { Metadata } from 'src/common/interfaces/response.interface';
import { createErrorMessage } from 'src/common/utils/exception.util';
import { InventoriesRepository } from './inventories.repository';
import { Inventory } from './schemas/inventory.schema';

@Injectable()
export class InventoriesService {
  constructor(private readonly inventoriesRepo: InventoriesRepository) { }

  //CREATE//
  //create one Doc (document) phân biệt với create Dto
  async createModel(payload: Inventory) {
    try {
      const created = await this.inventoriesRepo.createOne(payload);
      if (!created)
        throw new BadRequestException(createErrorMessage('inventory'));
      return created;
    } catch (error) {
      throw error;
    }
  }

  //UPDATE//
  async reserveInventory(productId: IKey, quantity: number, cartId: IKey): Promise<Metadata> {
    const query = { product: productId, stock: { $gte: quantity } };
    const payload = {
      $in: { stock: -quantity },
      $push: { reservations: { cartId, quantity, createdAt: new Date() } }
    };
    const updated = await this.inventoriesRepo.updateOneByQuery(payload, query);
    return updated ? { updatedCount: 1 } : { updatedCount: 0 };
  }

  //QUERY//


  //ONE DETAIL//


  //CANCEL//

  //UPDATE STATUS BY SELLER / ADMIN//
}
