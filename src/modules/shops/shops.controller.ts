import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';
import { User } from 'src/common/decorators/user.decorator';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';

@ApiTags('Shops Module for Admins')
@Controller('/adm/shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) { }

  // CREATE //
  /**
   * @desc create a shop
   * @param { Dto } createShopDto
   * @param { Request.user } user
   * @returns { JSON }
   */
  @ApiMessage('create a shop')
  @Post()
  create(
    @Body() createShopDto: CreateShopDto,
    @User() user: AuthUserDto
  ) {
    return this.shopsService.create(createShopDto);
  }
  // END CREATE //

  @Get()
  findAll() {
    return this.shopsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shopsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShopDto: UpdateShopDto) {
    return this.shopsService.update(+id, updateShopDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shopsService.remove(+id);
  }
}