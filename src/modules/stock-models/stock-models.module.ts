import { Module } from '@nestjs/common';
import { StockModelsService } from './stock-models.service';
import { StockModelsController } from './stock-models.controller';

@Module({
  controllers: [StockModelsController],
  providers: [StockModelsService],
})
export class StockModelsModule {}
