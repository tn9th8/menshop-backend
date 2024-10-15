import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { IProduct } from './schemas/product.schema';
import { Types } from 'mongoose';

@ApiTags('Products Module for Admins')
@Controller('/admin/products')
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) { }

  //CREATE//
  /**
   * @desc create one
   * @param { dto } createProductDto
   * @param { user} user
   * @returns { JSON }
   */
  @ApiMessage('create a product')
  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @User() user: AuthUserDto
  ) {
    return this.productsService.create({
      ...createProductDto,
      shop: user?.shop || null,
    });
  }
  //END CREATE//

  //QUERY//
  /**
   * @desc find all is draft
   * @param { request.user } user
   * @returns { JSON }
   */
  @ApiMessage('find all is draft')
  @Get('/draft')
  findAllIsDraft(@User() user: AuthUserDto): Promise<IProduct[]> {
    return this.productsService.findAllIsPublishedOrDraft(user?.shop, false);
  }

  /**
   * @desc find all is published
   * @param { request.user } user
   * @returns { JSON }
   */
  @ApiMessage('find all is published')
  @Get('/published')
  findAllIsPublished(@User() user: AuthUserDto): Promise<IProduct[]> {
    return this.productsService.findAllIsPublishedOrDraft(user?.shop, true);
  }
  //END QUERY//

  //UPDATE//
  @ApiMessage('publish a product')
  @Patch('/published/:id')
  publishOne(
    @User() user: AuthUserDto,
    @Param('id') id: Types.ObjectId
  ) {
    return this.productsService.publishOrUnpublishOne(user?.shop, id, true);
  }
  //END UPDATE//
}
