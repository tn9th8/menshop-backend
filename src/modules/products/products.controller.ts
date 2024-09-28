import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { SkipJwt } from 'src/common/decorators/skip-jwt.decorator';
import { ProductsEnum, ProductsFactory } from './factory/products.factory';

@ApiTags('Products Module for Admins')
@Controller('adm/products')
export class ProductsController {
  constructor(
    private readonly productsFactory: ProductsFactory,
  ) { }

  @SkipJwt()
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsFactory.create((createProductDto as any).type, createProductDto);
  }

  // @Get()
  // findAll() {
  //   return this.productsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.productsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  //   return this.productsService.update(+id, updateProductDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.productsService.remove(+id);
  // }
}
