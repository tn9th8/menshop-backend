import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { IProduct } from './schemas/product.schema';

@ApiTags('Products Module for Admins')
@Controller('/admin/products')
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) { }

  // CREATE //
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
  // END CREATE //

  // QUERY //
  /**
   * @desc find all is draft
   * @param { user } user
   * @returns { JSON }
   */
  @ApiMessage('find all is draft')
  @Get('/draft')
  findAllIsDraft(@User() user: AuthUserDto): Promise<IProduct[]> {
    return this.productsService.findAllIsDraft(user?.shop);
  }

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
