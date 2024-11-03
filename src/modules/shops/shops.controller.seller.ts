import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { IAuthUser } from 'src/common/interfaces/auth-user.interface';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { ShopsService } from './shops.service';

@ApiTags('Shops Module for Seller Side')
@Controller('/seller/shops')
export class ShopsControllerSeller {
  constructor(private readonly shopsService: ShopsService) { }
  //CREATE//
  @ApiMessage('create a own shop')
  @Post()
  create(
    @Body() createShopDto: CreateShopDto,
    @User() user: IAuthUser
  ) {
    return this.shopsService.create(createShopDto, user);
  }
  //UPDATE//
  @ApiMessage('update a own shop')
  @Patch()
  update(
    @Body() updateShopDto: UpdateShopDto,
    @User() user: IAuthUser
  ) {
    return this.shopsService.update(updateShopDto, user);
  }
  //QUERY//
  @ApiMessage('find a owned shop')
  @Get()
  findOwn(
    @User() user: IAuthUser
  ) {
    return this.shopsService.findOwnShop(user);
  }


}
