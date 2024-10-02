import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsFactory } from './factory/products.factory';

@ApiTags('Products Module for Admins')
@Controller('adm/products')
export class ProductsController {
  constructor(
    private readonly productsFactory: ProductsFactory,
  ) { }

  @Post()
  create(@Body() createProductDto: CreateProductDto, @User() user) {
    //todo: use generic instead any
    //todo: any
    return this.productsFactory.create({ ...createProductDto });
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
