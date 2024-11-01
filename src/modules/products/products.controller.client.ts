import { Controller, Get, Param, Query, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { ProductsService } from './products.service';
import { SkipJwt } from 'src/common/decorators/skip-jwt.decorator';
import { IKey } from 'src/common/interfaces/index.interface';
import { IdParamTransform } from 'src/middleware/pipe/id-param.transform';
import { QueryProductTransform } from './transform/query-product.transform';
import { QueryProductDto } from './dto/query-product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { SearchProductTransform } from './transform/search-product.transform';

@ApiTags('Products Module For Client Side')
@Controller('/client/products')
export class ProductsControllerClient {
  constructor(private readonly productsService: ProductsService) { }

  //QUERY//
  @ApiMessage('Search all products')
  @SkipJwt()
  @Get('/search')
  @UsePipes(SearchProductTransform)
  searchAll(
    @Query() query: SearchProductDto
  ) {
    return this.productsService.searchAll(query);
  }

  @ApiMessage('Find all products')
  @SkipJwt()
  @Get()
  @UsePipes(SearchProductTransform)
  findAll(
    @Query() query: SearchProductDto
  ) {
    return this.productsService.findAllForSales(query);
  }

  @ApiMessage('Find a product')
  @SkipJwt()
  @UsePipes(IdParamTransform)
  @Get('/:id([a-f0-9]{24})')
  findOne(@Param('id') id: IKey) {
    return this.productsService.findOneValidById(id);
  }
  //END QUERY//
}
