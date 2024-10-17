import { Module } from '@nestjs/common';
import { StockModelsService } from './stock-models.service';
import { StockModelsController } from './stock-models.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StockModel, StockModelSchema } from './schemas/stock-model.schema';

@Module({
  controllers: [StockModelsController],
  providers: [StockModelsService],
  imports: [MongooseModule.forFeature([{ name: StockModel.name, schema: StockModelSchema }])]
})
export class StockModelsModule { }
