import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { IAuthUser } from 'src/common/interfaces/auth-user.interface';

@Controller('/client/orders')
export class OrdersControllerClient {
  constructor(private readonly ordersService: OrdersService) { }

  @ApiMessage('review a checkout')
  @Post('/review-checkout')
  async reviewCheckout(@Body() shopOrders: any, @User() client: IAuthUser) {
    return await this.ordersService.reviewCheckout(shopOrders, client);
  }

  @ApiMessage('confirm a checkout')
  @Post('/confirm-checkout')
  async confirmCheckout(@Body() shopOrders: any, @User() client: IAuthUser) {
    const time = new Date();
    console.log(">>> order time:" + time);
    return await this.ordersService.confirmCheckout(shopOrders, client);
  }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
