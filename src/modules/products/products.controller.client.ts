import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsFactory } from './factory/products.factory';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';
import { ProductsService } from './products.service';
import { IProduct } from './schemas/product.schema';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { Request } from 'express';

@ApiTags('Products Module for Admins')
@Controller('/client/products')
export class ClientProductsController {
  constructor(private readonly productsService: ProductsService) { }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.productsService.findOne(+id);
  // }
  // END QUERY //

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  //   return this.productsService.update(+id, updateProductDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.productsService.remove(+id);
  // }
}
