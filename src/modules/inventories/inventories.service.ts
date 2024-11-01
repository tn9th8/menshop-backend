import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { InventoriesRepository } from './inventories.repository';
import { Inventory } from './schemas/inventory.schema';
import { createErrorMessage } from 'src/common/utils/exception.util';

@Injectable()
export class InventoriesService {
  constructor(
    private readonly inventoriesRepo: InventoriesRepository
  ) { }

  //CREATE//
  //create one Doc (document) phân biệt với create Dto
  async createModel(payload: Inventory) {
    try {
      const created = await this.inventoriesRepo.createOne(payload);
      if (!created) {
        throw new BadRequestException(createErrorMessage('inventory'));
      }
      return created;
    } catch (error) {
      throw error;
    }
  }
}
