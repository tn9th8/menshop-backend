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

@ApiTags('Products Module For Admin Side')
@Controller('/admin/products')
export class ProductsControllerAdmin {
  constructor(private readonly productsService: ProductsService) { }

  //CREATE//
  /**
   * @desc create one
   * @param { dto } createProductDto
   * @param { user} user
   * @returns { JSON }
   */
  // @ApiMessage('create a product')
  // @Post()
  // create(
  //   @User() user: AuthUserDto,
  //   @Body() createProductDto: CreateProductDto,
  // ) {
  //   return this.productsService.create({
  //     ...createProductDto,
  //     shop: user?.shop,
  //   });
  // }
  //END CREATE//

  //QUERY//
  @ApiMessage('find all active products')
  @Get('/active')
  @UsePipes(QueryProductTransform)
  findAllActive(
    @Query() query: QueryProductDto
  ) {
    return this.productsService.findAllByQueryAndIsActive(query, IsActiveEnum.ACTIVE);
  }

  @ApiMessage('find all disable products')
  @Get('/disable')
  @UsePipes(QueryProductTransform)
  findAllDisable(
    @Query() query: QueryProductDto
  ) {
    return this.productsService.findAllByQueryAndIsActive(query, IsActiveEnum.DISABLE);
  }

  @ApiMessage('find all draft products')
  @Get('/draft')
  @UsePipes(QueryProductTransform)
  findAllDraft(
    @Query() query: QueryProductDto,
    @User() user: AuthUserDto //todo: token
  ) {
    return this.productsService.findAllByQueryAndIsPublished(query, IsPublishedEnum.DRAFT);
  }

  @ApiMessage('find all published products')
  @Get('/published')
  @UsePipes(QueryProductTransform)
  findAllPublished(
    @Query() query: QueryProductDto,
    @User() user: AuthUserDto //todo: token
  ) {
    return this.productsService.findAllByQueryAndIsPublished(query, IsPublishedEnum.PUBLISHED);
  }
  //END QUERY//

  //UPDATE//
  // @ApiMessage('publish a product')
  // @Patch('/published/:id')
  // publishOne(
  //   @User() user: AuthUserDto,
  //   @Param('id') id: string
  // ) {
  //   return this.productsService.updateIsPublished(user?.shop, id, true);
  // }

  // @ApiMessage('publish a product')
  // @Patch('/unpublished/:id')
  // unpublishOne(
  //   @User() user: AuthUserDto,
  //   @Param('id') id: string
  // ) {
  //   return this.productsService.updateIsPublished(user?.shop, id, false);
  // }

  // @ApiMessage('update a product')
  // @Patch()
  // updateOne(
  //   @User() user: AuthUserDto,
  //   @Body() payload: UpdateProductDto
  // ) {
  //   return this.productsService.updateOne(user?.shop, payload);
  // }
  //END UPDATE//
}
