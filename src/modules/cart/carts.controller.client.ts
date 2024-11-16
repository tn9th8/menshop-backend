import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { IAuthUser } from 'src/common/interfaces/auth-user.interface';
import { CartsService } from './carts.service';
import { CartItemDto, RemoveItemsDto, UpdateCartItemDto } from './dto/cart-item.dto';

@Controller('/client/carts')
export class CartsControllerClient {
  constructor(private readonly cartService: CartsService) { }

  //UPDATE//
  @ApiMessage('add a product item to cart')
  @Patch('/add-to-cart')
  addToCart(
    @Body() body: CartItemDto,
    @User() client: IAuthUser
  ) {
    return this.cartService.addToCart(body, client);
  }

  @ApiMessage('remove product items from cart')
  @Patch('/remove-from-cart')
  removeFromCart(
    @Body() body: RemoveItemsDto,
    @User() client: IAuthUser
  ) {
    return this.cartService.removeFromCart(body, client);
  }

  @ApiMessage('add a item to cart')
  @Patch('/update-quantity')
  updateQuantity(
    @Body() body: UpdateCartItemDto,
    @User() client: IAuthUser
  ) {
    return this.cartService.updateQuantity(body, client);
  }

  //QUERY//
  @ApiMessage('find a owned cart')
  @Get('/')
  findOwn(
    @User() client: IAuthUser
  ) {
    return this.cartService.findMyCart(client);
  }
}
