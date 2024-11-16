import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { IsSelectEnum } from 'src/common/enums/index.enum';
import { IAuthUser } from 'src/common/interfaces/auth-user.interface';
import { IKey } from 'src/common/interfaces/index.interface';
import { createErrorMessage, isDisableMessage, isExistMessage, notFoundMessage } from 'src/common/utils/exception.util';
import { CartsRepository } from './carts.repository';
import { CartItemDto, RemoveItemsDto, UpdateCartItemDto } from './dto/cart-item.dto';

@Injectable()
export class CartsService {
  constructor(private readonly cartsRepo: CartsRepository) { }
  //CREATE//
  /**
   * upsert cart when add a productItem (quantity = 1) to cart, but cart don't have the one
   * @param body
   * @param client
   * @returns
   */
  async upsertCart(body: CartItemDto, client: IAuthUser) {
    const query = { client: client.id };
    const payload = {
      $addToSet: { productItems: body },
      $inc: { count: body.quantity }
    };
    const upserted = await this.cartsRepo.upsertOneByQuery(payload, query);
    if (!upserted)
      throw new BadRequestException('Lỗi khi upsert một cart');
    return upserted;
  }

  /**
   * create cart when create client
   * @param payload {
   *    client: IKey
   * }
   * @returns cartDoc
   */
  async createCartForUser(payload: any) {
    if (await this.cartsRepo.isExistByQuery({ client: payload.client }))
      throw new ConflictException(isExistMessage('client'));
    const created = await this.cartsRepo.createOne(payload);
    if (!created)
      throw new BadRequestException(createErrorMessage('shop'));
    return created;
  }

  //UPDATE//
  async updateQuantity(body: UpdateCartItemDto, client: IAuthUser) {
    const { _id, quantity } = body;
    //when quantity = 0, remove item
    if (quantity <= 0) {
      return await this.removeFromCart({ productItems: [_id] }, client);
    }
    //update
    const query = {
      client: client.id,
      'productItems._id': _id,
    };
    const payload = {
      'productItems.$.quantity': quantity,
      // $inc: { count: quantity }
    };
    const updated = await this.cartsRepo.updateOneByQuery(payload, query);
    if (!updated)
      throw new NotFoundException(notFoundMessage('item'));
    return updated;
  }

  async addToCart(body: CartItemDto, client: IAuthUser) {
    const { id: clientId } = client;
    //when client has not had a cart, create one
    let foundCart = await this.cartsRepo.findOneByQueryRaw({ client: clientId });
    if (!foundCart)
      return await this.upsertCart(body, client);
    //when cart is disable, announce mes
    if (!foundCart.isActive)
      throw new ForbiddenException(isDisableMessage('cart của bạn'));
    // //when cart has than 30 productItems, announce mes
    // if (foundCart.count >= 40)
    //   throw new ForbiddenException("Cart của bạn đã có tối đa 40 sản phẩm. Hãy thanh toán nào!");
    //when cart has productItems, productItems had the request item (body), update quantity

    const item = foundCart.productItems.find(item => item.product == body.product && item.variant == body.variant) || null;
    if (item) {
      const increase = body.quantity; //plus or minus
      return await this.updateQuantity({ _id: (item as any)._id, quantity: item.quantity + increase }, client);
    }
    //add the request item (body) to cart productItems
    return await this.upsertCart(body, client);
  }

  async removeFromCart(body: RemoveItemsDto, client: IAuthUser) {
    const query = { client: client.id };
    const payload = { $pull: { productItems: { _id: { $in: body.productItems } } } };
    let updated = await this.cartsRepo.updateOneByQuery(payload, query);
    if (!updated)
      throw new NotFoundException(notFoundMessage('item'));
    return updated;
    // let count = 0;
    // if (updated.productItems.length > 0) {
    //   count = updated.productItems.reduce((acc, item) => acc + item.quantity, 0);
    // }
    // return await this.cartsRepo.updateOneByQuery({ count }, query);
  }

  async findMyCart(client: IAuthUser) {
    const query = { client: client.id };
    const found = await this.cartsRepo.findOneByQueryRefer(query, [], IsSelectEnum.SELECT);
    if (!found)
      throw new NotFoundException(notFoundMessage('cart of client'));
    return found;
  }

  async findMyCartId(clientId: IKey) {
    const found = await this.cartsRepo.findOneByQueryRaw({ client: clientId }, ['_id']);
    if (!found)
      throw new NotFoundException(notFoundMessage('cart of client'));
    return found;
  }

  //payment
  /*
   * @param productItems: string => IKey[]
   */
  async checkProductItems(clientId: any, productItemIds: any, shopId: any) {
    const productItems = await this.cartsRepo.checkProductItems(clientId, productItemIds, shopId)
    return productItems;
  }
}
