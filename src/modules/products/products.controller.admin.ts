import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { IProduct } from './schemas/product.schema';
import { Types } from 'mongoose';
import { UpdateProductDto } from './dto/update-product.dto';

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
  @ApiMessage('create a product')
  @Post()
  create(
    @User() user: AuthUserDto,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productsService.create({
      ...createProductDto,
      shop: user?.shop,
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
    return this.productsService.findAllByIsPublished(user?.shop, false);
  }

  /**
   * @desc find all is published
   * @param { request.user } user
   * @returns { JSON }
   */
  @ApiMessage('find all is published')
  @Get('/published')
  findAllIsPublished(@User() user: AuthUserDto): Promise<IProduct[]> {
    return this.productsService.findAllByIsPublished(user?.shop, true);
  }
  //END QUERY//

  //UPDATE//
  @ApiMessage('publish a product')
  @Patch('/published/:id')
  publishOne(
    @User() user: AuthUserDto,
    @Param('id') id: string
  ) {
    return this.productsService.updateIsPublished(user?.shop, id, true);
  }

  @ApiMessage('publish a product')
  @Patch('/unpublished/:id')
  unpublishOne(
    @User() user: AuthUserDto,
    @Param('id') id: string
  ) {
    return this.productsService.updateIsPublished(user?.shop, id, false);
  }

  @ApiMessage('update a product')
  @Patch()
  updateOne(
    @User() user: AuthUserDto,
    @Body() payload: UpdateProductDto
  ) {
    return this.productsService.updateOne(user?.shop, payload);
  }
  //END UPDATE//
}
