import { Body, Controller, Get, Param, Patch, Post, Query, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { IProduct } from './schemas/product.schema';
import { Types } from 'mongoose';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductTransform } from './transform/query-product.transform';
import { QueryProductDto } from './dto/query-product.dto';
import { IsActiveEnum, IsPublishedEnum } from 'src/common/enums/index.enum';
import { IdParamTransform } from 'src/core/pipe/id-param.transform';
import { IKey } from 'src/common/interfaces/index.interface';

@ApiTags('Products Module For Admin Side')
@Controller('/admin/products')
export class ProductsControllerAdmin {
  constructor(private readonly productsService: ProductsService) { }

  //CREATE//
  @ApiMessage('create a product')
  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @User() user: AuthUserDto
  ) {
    return this.productsService.createOne(createProductDto, user);
  }

  //UPDATE//
  @ApiMessage('publish a product')
  @Patch('/published/:id([a-f0-9]{24})')
  publishOne(
    @Param('id', IdParamTransform) id: IKey,
    @User() user: AuthUserDto,
  ) {
    return this.productsService.updateIsPublished(id, IsPublishedEnum.PUBLISHED, user);
  }

  @ApiMessage('publish a product')
  @Patch('/draft/:id([a-f0-9]{24})')
  unpublishOne(
    @Param('id', IdParamTransform) id: IKey,
    @User() user: AuthUserDto,
  ) {
    return this.productsService.updateIsPublished(id, IsPublishedEnum.DRAFT, user);
  }

  @ApiMessage('active a shop')
  @Patch('/active/:id([a-f0-9]{24})')
  @UsePipes(IdParamTransform)
  activeOne(@Param('id') id: IKey) {
    return this.productsService.updateIsActive(id, IsActiveEnum.ACTIVE);
  }

  @ApiMessage('disable a shop')
  @Patch('/disable/:id([a-f0-9]{24})')
  @UsePipes(IdParamTransform)
  disableOne(@Param('id') id: IKey) {
    return this.productsService.updateIsActive(id, IsActiveEnum.DISABLE);
  }

  @ApiMessage('update a product')
  @Patch()
  updateOne(
    @Body() payload: UpdateProductDto,
    @User() user: AuthUserDto
  ) {
    return this.productsService.updateOne(payload, user);
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
  @UsePipes(QueryProductTransform)
  findAllDraft(
    @Query() query: QueryProductDto,
    @User() user: AuthUserDto //todo: token
  ) {
    return this.productsService.findAllIsPublishedByQuery(query, IsPublishedEnum.DRAFT, user);
  }

  @ApiMessage('find all published products')
  @Get('/published')
  @UsePipes(QueryProductTransform)
  findAllPublished(
    @Query() query: QueryProductDto,
    @User() user: AuthUserDto //todo: token
  ) {
    return this.productsService.findAllIsPublishedByQuery(query, IsPublishedEnum.PUBLISHED, user);
  }

  @ApiMessage('find one user')
  @Get(':id([a-f0-9]{24})')
  @UsePipes(IdParamTransform)
  findOne(@Param('id') id: IKey) {
    return this.productsService.findOneById(id);
  }
  //END QUERY//
}
