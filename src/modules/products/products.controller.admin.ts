import { Controller, Get, Param, Patch, Query, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { GroupUserEnum, IsActiveEnum, IsPublishedEnum } from 'src/common/enums/index.enum';
import { IAuthUser } from 'src/common/interfaces/auth-user.interface';
import { IKey } from 'src/common/interfaces/index.interface';
import { IdParamTransform } from 'src/middleware/pipe/id-param.transform';
import { QueryProductDto } from './dto/query-product.dto';
import { ProductsService } from './products.service';
import { QueryProductTransform } from './transform/query-product.transform';

@ApiTags('Products Module For Admin Side')
@Controller('/admin/products')
export class ProductsControllerAdmin {
  constructor(private readonly productsService: ProductsService) { }
  //UPDATE//
  @ApiMessage('active a shop')
  @Patch('/active/:id')
  @UsePipes(IdParamTransform)
  activeOne(@Param('id') id: IKey) {
    return this.productsService.updateIsActive(id, IsActiveEnum.ACTIVE);
  }

  @ApiMessage('disable a shop')
  @Patch('/disable/:id')
  @UsePipes(IdParamTransform)
  disableOne(@Param('id') id: IKey) {
    return this.productsService.updateIsActive(id, IsActiveEnum.DISABLE);
  }
  //END UPDATE//

  //QUERY//
  @ApiMessage('find all active products')
  @Get('/active')
  @UsePipes(QueryProductTransform)
  findAllActive(
    @Query() query: QueryProductDto
  ) {
    return this.productsService.findAllIsActiveByQuery(query, IsActiveEnum.ACTIVE);
  }

  @ApiMessage('find all disable products')
  @Get('/disable')
  @UsePipes(QueryProductTransform)
  findAllDisable(
    @Query() query: QueryProductDto
  ) {
    return this.productsService.findAllIsActiveByQuery(query, IsActiveEnum.DISABLE);
  }

  @ApiMessage('find all draft products')
  @Get('/draft')
  findAllDraft(
    @Query(QueryProductTransform) query: QueryProductDto
  ) {
    return this.productsService.findAllIsPublishedByQuery(query, IsPublishedEnum.DRAFT, GroupUserEnum.ADMIN);
  }

  @ApiMessage('find all published products')
  @Get('/published')
  findAllPublished(
    @Query(QueryProductTransform) query: QueryProductDto
  ) {
    return this.productsService.findAllIsPublishedByQuery(query, IsPublishedEnum.PUBLISHED, GroupUserEnum.ADMIN);
  }

  @ApiMessage('find one user')
  @Get(':id')
  @UsePipes(IdParamTransform)
  findOne(@Param('id') id: IKey) {
    return this.productsService.findOneById(id, GroupUserEnum.ADMIN);
  }
  //END QUERY//
}
