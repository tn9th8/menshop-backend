import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { GroupUserEnum, IsActiveEnum } from 'src/common/enums/index.enum';
import { IKey } from 'src/common/interfaces/index.interface';
import { IdParamTransform } from 'src/middleware/pipe/id-param.transform';
import { CartsService } from './carts.service';
import { CartQuery } from './schemas/cart.schema';
import { CartQueryTransform } from './transform/cart-query.transform';

@Controller('/admin/carts')
export class CartsControllerAdmin {
  constructor(private readonly cartService: CartsService) { }

  // //UPDATE//
  // @ApiMessage('active a cart')
  // @Patch('/active/:id')
  // activeOne(@Param('id', IdParamTransform) id: IKey) {
  //   return this.cartService.updateIsActive(id, IsActiveEnum.ACTIVE);
  // }

  // @ApiMessage('disable a cart')
  // @Patch('/disable/:id')
  // disableOne(@Param('id', IdParamTransform) id: IKey) {
  //   return this.cartService.updateIsActive(id, IsActiveEnum.DISABLE);
  // }
  // //QUERY//
  // @ApiMessage('find all active carts')
  // @Get('/active')
  // findAllActive(@Query(CartQueryTransform) query: CartQuery) {
  //   return this.cartService.findAllByQuery(query, IsActiveEnum.ACTIVE);
  // }

  // @ApiMessage('find all disable carts')
  // @Get('/disable')
  // findAllDisable(@Query(CartQueryTransform) query: CartQuery) {
  //   return this.cartService.findAllByQuery(query, IsActiveEnum.DISABLE);
  // }

  // @ApiMessage('find one cart')
  // @Get(':id')
  // findOne(@Param('id', IdParamTransform) id: IKey) {
  //   return this.cartService.findOneById(id, GroupUserEnum.ADMIN);
  // }
}
