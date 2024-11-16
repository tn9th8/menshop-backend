import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from 'src/common/decorators/user.decorator';
import { IAuthUser } from 'src/common/interfaces/auth-user.interface';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { IKey } from 'src/common/interfaces/index.interface';
import { IdParamTransform } from 'src/middleware/pipe/id-param.transform';

@Controller('/seller/orders')
export class OrdersControllerSeller {
  constructor(private readonly ordersService: OrdersService) { }

  // @Post()
  // create(@Body() createOrderDto: CreateOrderDto) {
  //   return this.ordersService.create(createOrderDto);
  // }

  @ApiMessage('get all orders')
  @Get()
  findAll(
    @User() seller: IAuthUser,
    @Query('status') status: string,
  ) {
    return this.ordersService.findAll(status, seller, 'seller');
  }

  @ApiMessage('get one orders')
  @Get(':id')
  findOne(@Param('id', IdParamTransform) id: IKey) {
    return this.ordersService.findOne(id);
  }

  @ApiMessage('update status of an order')
  @Patch(':id')
  update(@Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.updateOne(updateOrderDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ordersService.remove(+id);
  // }
}
