import { Body, Controller, Get, Param, Patch, Post, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { IAuthUser } from 'src/common/interfaces/auth-user.interface';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { ShopsService } from './shops.service';
import { IdParamTransform } from 'src/middleware/pipe/id-param.transform';
import { IKey } from 'src/common/interfaces/index.interface';

@ApiTags('Shops Module for Seller Side')
@Controller('/seller/shops')
export class ShopsControllerSeller {
  constructor(private readonly shopsService: ShopsService) { }
  //UPDATE//
  @ApiMessage('update a own shop')
  @Patch()
  update(
    @Body() updateShopDto: UpdateShopDto,
    @User() user: IAuthUser
  ) {
    return this.shopsService.update(updateShopDto, user);
  }

  @ApiMessage('open a shop')
  @Patch('/open/:id')
  openOne(@Param('id', IdParamTransform) id: IKey) {
    return this.shopsService.updateIsOpen(id, true);
  }

  @ApiMessage('close a shop')
  @Patch('/close/:id')
  closeOne(@Param('id', IdParamTransform) id: IKey) {
    return this.shopsService.updateIsOpen(id, false);
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
