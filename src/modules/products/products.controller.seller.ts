import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { GroupUserEnum, IsPublishedEnum } from 'src/common/enums/index.enum';
import { IAuthUser } from 'src/common/interfaces/auth-user.interface';
import { IKey } from 'src/common/interfaces/index.interface';
import { IdParamTransform } from 'src/middleware/pipe/id-param.transform';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { QueryProductTransform } from './transform/query-product.transform';

@ApiTags('Products Module For Admin Side')
@Controller('/seller/products')
export class ProductsControllerSeller {
  constructor(private readonly productsService: ProductsService) { }
  //CREATE//
  @ApiMessage('create a product')
  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @User() user: IAuthUser
  ) {
    return this.productsService.createOne(createProductDto, user);
  }
  //UPDATE//
  @ApiMessage('update a product')
  @Patch()
  updateOne(
    @Body() payload: UpdateProductDto,
    @User() user: IAuthUser
  ) {
    return this.productsService.updateOne(payload, user);
  }

  @ApiMessage('publish a product')
  @Patch('/published/:id')
  publishOne(
    @Param('id', IdParamTransform) id: IKey,
    @User() user: IAuthUser,
  ) {
    return this.productsService.updateIsPublished(id, IsPublishedEnum.PUBLISHED, user);
  }

  @ApiMessage('publish a product')
  @Patch('/draft/:id')
  draftOne(
    @Param('id', IdParamTransform) id: IKey,
    @User() user: IAuthUser,
  ) {
    return this.productsService.updateIsPublished(id, IsPublishedEnum.DRAFT, user);
  }
  //END UPDATE//

  //QUERY//
  @ApiMessage('find all draft products')
  @Get('/draft')
  findAllDraft(
    @Query(QueryProductTransform) query: QueryProductDto,
    @User() user: IAuthUser //todo: token
  ) {
    return this.productsService.findAllIsPublishedByQuery(query, IsPublishedEnum.DRAFT, GroupUserEnum.SELLER, user);
  }

  @ApiMessage('find all published products')
  @Get('/published')
  findAllPublished(
    @Query(QueryProductTransform) query: QueryProductDto,
    @User() user: IAuthUser //todo: token
  ) {
    return this.productsService.findAllIsPublishedByQuery(query, IsPublishedEnum.PUBLISHED, GroupUserEnum.SELLER, user);
  }

  @ApiMessage('find one user')
  @Get(':id')
  findOne(
    @Param('id', IdParamTransform) id: IKey,
    @User() user: IAuthUser
  ) {
    return this.productsService.findOneById(id, GroupUserEnum.SELLER);
  }
  //END QUERY//
}
