import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { ProductsService } from './products.service';
import { SkipJwt } from 'src/common/decorators/skip-jwt.decorator';

@ApiTags('Products Module For Client Side')
@Controller('/client/products')
export class ProductsControllerClient {
  constructor(private readonly productsService: ProductsService) { }

  //QUERY//
  @ApiMessage('Search all products for the client side')
  @SkipJwt()
  @Get('/search')
  searchAll(
    @Query('keyword') keyword: string,
    @Query('category') category: string,
    @Query('subcategory') subCategory: string,
  ) {
    return this.productsService.searchAll(keyword, category, subCategory);
  }

  @ApiMessage('Find all products for the client side')
  @SkipJwt()
  @Get()
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sort-by') sort: string,
  ) {
    return this.productsService.findAll({ page, limit, sort });
  }

  @ApiMessage('Find a product for the client side')
  @SkipJwt()
  @Get('/:id([a-f0-9]{24})')
  findDetail(@Param('id') id: string) {
    return this.productsService.findDetail(id);
  }
  //END QUERY//
}
