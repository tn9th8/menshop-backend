import { Controller, Get } from '@nestjs/common';
import { CartDiscountService } from './cart-discount.service';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { IAuthUser } from 'src/common/interfaces/auth-user.interface';

@Controller('/client/cart-discount')
export class CartDiscountController {
  constructor(private readonly cartDiscountService: CartDiscountService) { }
  //QUERY//
  @ApiMessage('find a owned cart')
  @Get('/')
  findMyCart(
    @User() client: IAuthUser
  ) {
    return this.cartDiscountService.findMyCart(client);
  }
}
