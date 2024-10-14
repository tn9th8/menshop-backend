import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StockModelsService } from './stock-models.service';
import { CreateStockModelDto } from './dto/create-stock-model.dto';
import { UpdateStockModelDto } from './dto/update-stock-model.dto';

@Controller('stock-models')
export class StockModelsController {
  constructor(private readonly stockModelsService: StockModelsService) {}

  @Post()
  create(@Body() createStockModelDto: CreateStockModelDto) {
    return this.stockModelsService.create(createStockModelDto);
  }

  @Get()
  findAll() {
    return this.stockModelsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockModelsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStockModelDto: UpdateStockModelDto) {
    return this.stockModelsService.update(+id, updateStockModelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockModelsService.remove(+id);
  }
}
