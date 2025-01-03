import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { SkipJwt } from 'src/common/decorators/skip-jwt.decorator';
import { IKey } from 'src/common/interfaces/index.interface';
import { IdParamTransform } from 'src/middleware/pipe/id-param.transform';
import { SearchProductDto } from './dto/search-product.dto';
import { ProductsService } from './products.service';
import { SearchProductTransform } from './transform/search-product.transform';
import { ProductInventoriesService } from './services/product-inventories.service';

@ApiTags('Products Module For Client Side')
@Controller('/client/products')
export class ProductsControllerClient {
  constructor(
    private readonly productsService: ProductsService,
    private readonly productInvenService: ProductInventoriesService) { }

  //QUERY//
  @ApiMessage('Search all products')
  @SkipJwt()
  @Get('/search')
  searchAll(
    @Query(SearchProductTransform) query: SearchProductDto
  ) {
    return this.productsService.searchAll(query);
  }

  @ApiMessage('Find all products')
  @SkipJwt()
  @Get()
  findAll(
    @Query(SearchProductTransform) query: SearchProductDto
  ) {
    return this.productsService.findAllForSales(query);
  }

  @ApiMessage('Find a product')
  @SkipJwt()
  @Get('/:id')
  findOne(@Param('id', IdParamTransform) id: IKey) {
    return this.productInvenService.findOneValidById(id);
  }
  //END QUERY//
}
