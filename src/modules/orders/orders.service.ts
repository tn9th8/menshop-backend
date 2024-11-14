import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { IAuthUser } from 'src/common/interfaces/auth-user.interface';
import { CartsService } from '../cart/carts.service';
import { createErrorMessage, notFoundMessage } from 'src/common/utils/exception.util';
import { ProductsService } from '../products/products.service';
import { DiscountsService } from '../discounts/discounts.service';
import { OrdersRedis } from './redis/orders.redis';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepo: OrdersRepository,
    private readonly ordersRedis: OrdersRedis,
    private readonly cartService: CartsService,
    private readonly productsService: ProductsService,
    private readonly discountsService: DiscountsService,
  ) { }

  /**
  client: {
    id
  }
  shopOrders: [
      shop: id
      discountCodes: [code (bị dư á ???)]
      productItems: [
        {
          _id
          // price
          quantity
        }
      ]
    ]

   * @param shopOrders
   * @param client
   */
  async reviewCheckout(shopOrders: any, client: IAuthUser) {
    const { id: clientId } = client;
    //check cart is available
    // const foundCart = await this.cartService.findOwnCartId(clientId);
    // if (!foundCart)
    //   throw new NotFoundException(notFoundMessage('cart'));

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

  async confirmCheckout(shopOrders: any, client: IAuthUser, shipTo = {}, payment = {}) {
    const { checkoutOrder, newShopOrders } = await this.reviewCheckout(shopOrders, client); //apply discount two times
    //check cart is available
    const foundCart = await this.cartService.findOwnCartId(client.id);
    if (!foundCart)
      throw new NotFoundException(notFoundMessage('cart'));
    //get array of products
    const productItems = newShopOrders.flatMap(shopOrder => shopOrder.productItems);
    const acquireProduct = [];
    for (const productItem of productItems) {
      const { _id: productId, quantity } = productItem;
      const keyLock = await this.ordersRedis.acquireLock(productId, quantity, foundCart._id);
      acquireProduct.push(keyLock ? true : false);
      if (keyLock) {
        await this.ordersRedis.releaseLock(keyLock);
      }
    }
    //nếu product hết hàng
    if (acquireProduct.includes(false)) {
      throw new BadRequestException('Thật là tiết. Một/Một số sản phẩm đã hết hàng. Vui lòng quay lại giỏ hàng');
    }
    //create order
    const createdOrder = await this.ordersRepo.createOrder({
      client: client.id,
      checkout: checkoutOrder,
      shopOrder: newShopOrders,
      trackingNumber: "#00000",
      shipTo,
      payment,
      status: "pending"
    });

    if (!createdOrder)
      throw new BadRequestException(createErrorMessage('Lỗi khi tạo 1 order'));

    //order thành công thì remove product items trong cart

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
