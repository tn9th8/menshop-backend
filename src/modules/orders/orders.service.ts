import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { IAuthUser } from 'src/common/interfaces/auth-user.interface';
import { IKey, IReference } from 'src/common/interfaces/index.interface';
import { createErrorMessage, notFoundMessage } from 'src/common/utils/exception.util';
import { CartsService } from '../cart/carts.service';
import { DiscountsService } from '../discounts/discounts.service';
import { ShopsService } from '../shops/shops.service';
import { UsersService } from '../users/users.service';
import { OrdersRepository } from './orders.repository';
import { OrdersRedis } from './redis/orders.redis';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepo: OrdersRepository,
    private readonly ordersRedis: OrdersRedis,
    private readonly cartService: CartsService,
    private readonly shopsService: ShopsService,
    private readonly discountsService: DiscountsService,
  ) { }

  /**
  client: {
    id
  }
  shopOrders: [{
    shop: id
    discountCodes: [code (bị dư á ???)]
    productItems: [_id] //productItems of cart
  }]

   * @param shopOrders
   * @param client
   */
  async reviewCheckout(shopOrders: any, client: IAuthUser, isConfirmDiscount: boolean) {
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
      //shop is available
      shop = await this.shopsService.findOneRaw(shop); //_id, name
      //productItems/shop is available
      productItems = await this.cartService.checkProductItems(client.id, productItems, shop._id); //full product
      if (productItems.length === 0) {
        continue;
        //throw new BadRequestException(notFoundMessage('any product'));
      }
      //calculate total price
      const totalPrice = productItems.reduce((acc, productItem) => {
        acc += (productItem.product.price * productItem.quantity);
        return acc;
      }, 0);
      checkoutOrder.totalPrice += totalPrice;
      const newShopOrder = {
        shop,
        totalPrice,
        totalDiscount: 0,
        totalCheckout: 0,
        isApplyDiscount: false,
        errorDiscount: "",
        productItems
      }
      //calculate total discount
      if (discountCodes.length > 0) {
        for (const code of discountCodes) {
          const {
            totalPrice: newTotalPrice, totalDiscount, totalCheckout,
            isApplyDiscount, errorDiscount
          } = await this.discountsService.applyDiscountV3({ shop: shop._id, code, productItems }, client, isConfirmDiscount);
          if (totalPrice !== newTotalPrice)
            throw new BadRequestException('Có lỗi khi apply discounts');
          checkoutOrder.totalDiscount += totalDiscount;
          checkoutOrder.totalCheckout += totalCheckout;
          newShopOrder.totalDiscount = totalDiscount;
          newShopOrder.totalCheckout = totalCheckout;
          newShopOrder.isApplyDiscount = isApplyDiscount;
          newShopOrder.errorDiscount = errorDiscount;
        }
      } else {
        checkoutOrder.totalCheckout += totalPrice;
        newShopOrder.totalCheckout = totalPrice;
      }
      newShopOrders.push(newShopOrder);
    }
    return { checkoutOrder, newShopOrders };
  }

  /**
client: {
  id
}
shopOrders: [{
  shop: id
  discountCodes: [code (bị dư á ???)]
  productItems: [_id] //productItems of cart
}]
 * @param shopOrders
 * @param client
 */
  async confirmCheckout(shopOrders: any, client: IAuthUser,
    shipTo = '46A, phường Linh Trung, quận Thủ Đức, TP.HCM', payment = 'COD', phone = '0985509091') {
    const isConfirmDiscount = true;
    const { checkoutOrder, newShopOrders } = await this.reviewCheckout(shopOrders, client, isConfirmDiscount);
    //check cart is available
    const foundCart = await this.cartService.findMyCartId(client.id);
    if (!foundCart)
      throw new NotFoundException(notFoundMessage('cart'));
    //order
    const endShopOrders = [];
    for (const shopOrder of newShopOrders) {
      //get array of products
      //const productItems = newShopOrders.flatMap(shopOrder => shopOrder.productItems);
      const acquireProduct = [];
      for (const productItem of shopOrder.productItems) {
        const { product, quantity } = productItem;
        const keyLock = await this.ordersRedis.acquireLock(product._id, quantity, foundCart._id);
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
      const { shop, totalPrice, totalDiscount, totalCheckout, productItems } = shopOrder
      const createdOrder = await this.ordersRepo.createOrder({
        client: client.id,
        shop: shop._id,
        checkout: { totalPrice, totalDiscount, totalCheckout },
        productItems: productItems,
        trackingNumber: "#00000",
        shipTo,
        payment,
        phone,
        status: "pending"
      });

      if (!createdOrder)
        throw new BadRequestException(createErrorMessage('Lỗi khi tạo 1 order'));
      console.log(`Checkout successfully, orderId: ${createdOrder._id}`);
      endShopOrders.push(createdOrder);
      //order thành công thì remove product items trong cart
      const cartItems = shopOrder.productItems.map(item => item.cartProductItem)
      await this.cartService.removeFromCart({ productItems: cartItems }, client);
    }
    return endShopOrders;
  }

  //UPDATE//
  async cancelOne(orderId: IKey) {
    const updated = await this.ordersRepo.updateOne({ status: 'cancelled' }, { _id: orderId, status: 'pending' });
    if (updated === null)
      throw new BadRequestException('Không thể cancel')
    return { updatedCount: 1 };
  }

  async updateOne(body: UpdateOrderDto) {
    const updated = await this.ordersRepo.updateOne({ status: body.status }, { _id: body._id });
    if (updated === null)
      throw new NotFoundException(notFoundMessage('order'))
    return updated;
  }

  //QUERY//
  /**
   * @param status: all, pending, shipping, completed, cancelled
   * @param client
   * @returns
   */
  async findAll(status: string, user: IAuthUser, userType: string) {
    let query;
    if (userType === 'client') {
      query = status === 'all' || !status
        ? { client: user.id }
        : { client: user.id, status };
    } else {
      const shop = await this.shopsService.findOwnShop(user); //_id, name
      query = status === 'all' || !status
        ? { shop: shop._id }
        : { shop: shop._id, status };
    }

    const references: IReference[] = [
      { attribute: 'shop', select: ['_id', 'name'] },
      { attribute: 'client', select: ['_id', 'name'] }];
    const all = await this.ordersRepo.findAll(query, [], references);
    return all;
  }


  async findOne(_id: IKey) {
    const references: IReference[] = [
      { attribute: 'shop', select: ['_id', 'name'] }];
    const found = await this.ordersRepo.findOne({ _id }, [], references);
    return found;
  }



  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
