import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { IAuthUser } from 'src/common/interfaces/auth-user.interface';
import { CartItemDto, RemoveItemsDto } from './dto/cart-item.dto';
import { CartsRepository } from './carts.repository';
import { createErrorMessage, isDisableMessage, notFoundMessage } from 'src/common/utils/exception.util';
import { CartQuery } from './schemas/cart.schema';
import { IsSelectEnum, SortEnum } from 'src/common/enums/index.enum';
import { IKey } from 'src/common/interfaces/index.interface';

@Injectable()
export class CartsService {
  constructor(private readonly cartsRepo: CartsRepository) { }
  //CREATE//
  async upsertCart(body: any, client: IAuthUser) {
    const { items } = body;
    const query = { client: client.id };
    const payload = { $addToSet: { items: items } };
    const upserted = await this.cartsRepo.upsertOneByQuery(payload, query);
    if (!upserted)
      throw new BadRequestException('Lỗi khi upsert một cart');
    return upserted;
  }
  //UPDATE//
  async updateQuantity(body: CartItemDto, client: IAuthUser) {
    const { product: productId, quantity } = body;
    //when quantity = 0, delete item
    if (quantity <= 0) {
      return await this.removeFromCart({ products: [productId] }, client)
    }
    const query = {
      client: client.id,
      'items.product': productId
    };
    const payload = { 'items.$.quantity': quantity };
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
      return await this.upsertCart({ items: body }, client);
    //when cart is disable, announce mes
    if (!foundCart.isActive)
      throw new ForbiddenException(isDisableMessage('cart của bạn'));
    //when cart has than 30 items, announce mes
    if (foundCart.items.length >= 30)
      throw new ForbiddenException("Cart của bạn đã có đến 30 sản phẩm. Hãy thanh toán nào !");
    //when cart has items, items had the request item (body), update quantity
    const item = foundCart.items.find(item => item.product === body.product) || null;
    if (item)
      return await this.updateQuantity({ ...body, quantity: item.quantity + body.quantity }, client);
    //add the request item (body) to cart items
    return await this.upsertCart({ items: body }, client);
  }

  async removeFromCart(body: RemoveItemsDto, client: IAuthUser) {
    const query = { client: client.id };
    const payload = { $pull: { items: { product: { $in: body.products } } } };
    const updated = await this.cartsRepo.updateOneByQuery(payload, query);
    if (!updated)
      throw new NotFoundException(notFoundMessage('item'));
    return updated;
  }

  async findOwnCart(client: IAuthUser) {
    const query = { client: client.id };
    const found = await this.cartsRepo.findOneByQueryRefer(query, [], IsSelectEnum.SELECT);
    if (!found)
      throw new NotFoundException(notFoundMessage('shop by seller'));
    return found;
  }

  async findOwnCartId(clientId: IKey) {
    const found = await this.cartsRepo.findOneByQueryRaw({ client: clientId }, ['_id']);
    if (!found)
      throw new NotFoundException(notFoundMessage('shop by seller'));
    return found;
  }
}
