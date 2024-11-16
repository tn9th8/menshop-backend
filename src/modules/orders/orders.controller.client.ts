import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { IAuthUser } from 'src/common/interfaces/auth-user.interface';
import { IKey } from 'src/common/interfaces/index.interface';
import { IdParamTransform } from 'src/middleware/pipe/id-param.transform';

@Controller('/client/orders')
export class OrdersControllerClient {
  constructor(private readonly ordersService: OrdersService) { }

  @ApiMessage('review a checkout')
  @Post('/review-checkout')
  async reviewCheckout(@Body() shopOrders: any, @User() client: IAuthUser) {
    const isConfirmDiscount = false;
    return await this.ordersService.reviewCheckout(shopOrders, client, isConfirmDiscount);
  }

  @ApiMessage('confirm a checkout')
  @Post('/confirm-checkout')
  async confirmCheckout(@Body() shopOrders: any, @User() client: IAuthUser) {
    const time = new Date();
    return await this.ordersService.confirmCheckout(shopOrders, client);
  }

  @ApiMessage('get all orders')
  @Get()
  findAll(
    @User() client: IAuthUser,
    @Query('status') status: string,
  ) {
    return this.ordersService.findAll(status, client, 'client');
  }

  @Patch(':id')
  cancel(@Param('id', IdParamTransform) orderId: IKey) {
    return this.ordersService.cancelOne(orderId);
  }

  @ApiMessage('get one orders')
  @Get(':id')
  findOne(@Param('id', IdParamTransform) id: IKey) {
    return this.ordersService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
