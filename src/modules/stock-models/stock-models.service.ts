import { Injectable } from '@nestjs/common';
import { CreateStockModelDto } from './dto/create-stock-model.dto';
import { UpdateStockModelDto } from './dto/update-stock-model.dto';

@Injectable()
export class StockModelsService {
  create(createStockModelDto: CreateStockModelDto) {
    return 'This action adds a new stockModel';
  }

  findAll() {
    return `This action returns all stockModels`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stockModel`;
  }

  update(id: number, updateStockModelDto: UpdateStockModelDto) {
    return `This action updates a #${id} stockModel`;
  }

  remove(id: number) {
    return `This action removes a #${id} stockModel`;
  }
}
