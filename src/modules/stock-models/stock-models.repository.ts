import { Injectable } from '@nestjs/common';
import { CreateStockModelDto } from './dto/create-stock-model.dto';
import { UpdateStockModelDto } from './dto/update-stock-model.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IStockModel, StockModel } from './schemas/stock-model.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class StockModelsRepository {
  constructor(
    @InjectModel(StockModel.name)
    private readonly stockModel: SoftDeleteModel<IStockModel>
  ) { }
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
