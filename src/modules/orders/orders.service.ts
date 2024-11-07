import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { IAuthUser } from 'src/common/interfaces/auth-user.interface';
import { CartsService } from '../cart/carts.service';
import { notFoundMessage } from 'src/common/utils/exception.util';
import { ProductsService } from '../products/products.service';
import { DiscountsService } from '../discounts/discounts.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly cartService: CartsService,
    private readonly productsService: ProductsService,
    private readonly discountsService: DiscountsService,
  ) { }

  /**
  client: {
    clientId
  }
  shopOrders: {
    shopOrderIds: [
      shopId:
      discountCodes: [code (bị dư á ???)]
      productItems: [
        {
          _id
          price
          quantity
        }
      ]
    ]
  }
   * @param shopOrders
   * @param client
   */
  async reviewCheckout(shopOrders: any, client: IAuthUser) {
    const { id: clientId } = client;
    //check cart is available
    const foundCart = await this.cartService.findOwnCartId(clientId);
    if (!foundCart)
      throw new NotFoundException(notFoundMessage('cart'));

    const checkoutOrder = {
      totalPrice: 0,
      shipFee: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    }
    const newShopOrders = [];

    //calculate total bill
    for (const shopOrder of shopOrders) {
      let { shop, discountCodes, productItems } = shopOrder;
      //check products is available
      productItems = await this.productsService.checkProductItem(productItems);
      if (!productItems[0])
        throw new NotFoundException(notFoundMessage('any product'));
      //calculate total price
      const totalPrice = productItems.reduce((acc, productItem) => {
        acc += (productItem.price * productItem.quantity);
        return acc;
      }, 0);
      checkoutOrder.totalPrice += totalPrice;
      const newShopOrder = {
        shop,
        totalPrice,
        totalDiscount: 0,
        totalCheckout: 0,
        productItems
      }
      //calculate total discount
      if (discountCodes.length > 0) {
        for (const code of discountCodes) {
          const { totalPrice, totalDiscount, totalCheckout } = await this.discountsService.applyDiscount(
            { shop, code, productItems }, client);
          if (totalPrice !== checkoutOrder.totalPrice)
            throw new BadRequestException('Có lỗi khi apply discounts');
          checkoutOrder.totalDiscount += totalDiscount;
          checkoutOrder.totalCheckout += totalCheckout;
          newShopOrder.totalDiscount = totalDiscount;
          newShopOrder.totalCheckout = totalCheckout;
        }
      }
      newShopOrders.push(newShopOrder);
    }
    return { checkoutOrder, newShopOrders };
  }

  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
