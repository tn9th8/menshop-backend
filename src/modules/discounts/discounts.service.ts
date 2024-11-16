import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DiscountApplyTo, DiscountType } from 'src/common/enums/discount.enum';
import { GroupUserEnum, IsSelectEnum, IsValidEnum, SortEnum } from 'src/common/enums/index.enum';
import { IAuthUser } from 'src/common/interfaces/auth-user.interface';
import { IKey, IReference } from 'src/common/interfaces/index.interface';
import { Result, ResultOne } from 'src/common/interfaces/response.interface';
import { createErrorMessage, isExistMessage, notFoundIdMessage, notFoundMessage } from 'src/common/utils/exception.util';
import { isGreaterThanToday } from 'src/common/utils/index.util';
import { buildQueryExcludeId, buildQueryLike, buildQueryModelIdSellerId, computeItemsAndPages } from 'src/common/utils/mongo.util';
import { ProductSortEnum } from 'src/modules/products/enum/product.enum';
import { ProductsService } from '../products/products.service';
import { ProductDocument } from '../products/schemas/product.schema';
import { ShopsService } from '../shops/shops.service';
import { DiscountsRepository } from './discounts.repository';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { Discount, DiscountDoc, DiscountQuery } from './schemas/discount.schema';

@Injectable()
export class DiscountsService {
  constructor(
    private readonly discountsRepo: DiscountsRepository,
    private readonly shopsService: ShopsService,
    private readonly productsService: ProductsService,
  ) { }
  //CREATE//
  async createDiscountForShop(body: CreateDiscountDto, user: IAuthUser) {
    const { id: sellerId } = user;
    const { name, code, description, type, value, startDate, endDate, minPurchaseValue,
      applyMax, applyMaxPerClient, applyTo, specificProducts } = body;
    //code not exist //note: name not exist, specificProducts is exist
    if (await this.discountsRepo.existDiscountByQuery({ code }))
      throw new ConflictException(isExistMessage('code'));
    //find shopId
    const shop = await this.shopsService.findShopBySeller(sellerId);
    //create discount: case applyTo is all => exclude specificProducts
    let createdDiscount: DiscountDoc;
    const newBody = {
      name, code, description, type, value, startDate, endDate, minPurchaseValue,
      applyMax, applyMaxPerClient, applyTo, shop: shop._id, seller: sellerId
    };
    if (applyTo === DiscountApplyTo.ALL)
      createdDiscount = await this.discountsRepo.createDiscount(newBody)
    else if (applyTo === DiscountApplyTo.SPECIFIC)
      createdDiscount = await this.discountsRepo.createDiscount({ ...newBody, specificProducts })
    else
      createdDiscount = null;
    if (!createdDiscount)
      throw new BadRequestException(createErrorMessage('discount'));
    return createdDiscount;
  }
  //UPDATE//
  async updateDiscountForShop(body: UpdateDiscountDto, user: IAuthUser) {
    const { id: sellerId } = user;
    const { id: discountId, name, code, description, type, value, startDate, endDate, minPurchaseValue,
      applyMax, applyMaxPerClient, applyTo, specificProducts } = body;
    //code not exist: //note: discount is expired => ko dc update => query isValid true. discount is valid => update date > tody => isValid = true  (luôn đúng)
    if (await this.discountsRepo.existDiscountByQuery(buildQueryExcludeId({ code, isValid: true }, discountId)))
      throw new ConflictException(isExistMessage('code'));
    //updated discount: case applyTo is all => exclude specificProducts
    let updatedDiscount: DiscountDoc;
    const payload = {
      name, code, description, type, value, startDate, endDate, minPurchaseValue,
      applyMax, applyMaxPerClient, applyTo
    };
    if (applyTo === DiscountApplyTo.ALL)
      updatedDiscount = await this.discountsRepo.updateDiscountByQuery(
        payload, buildQueryModelIdSellerId(discountId, sellerId));
    else if (applyTo === DiscountApplyTo.SPECIFIC)
      updatedDiscount = await this.discountsRepo.updateDiscountByQuery(
        { ...payload, specificProducts }, buildQueryModelIdSellerId(discountId, sellerId));
    else
      updatedDiscount = null;
    if (!updatedDiscount)
      throw new NotFoundException(notFoundIdMessage('discountId', discountId));
    return updatedDiscount;
  }
  //
  /*
   * @param body: {
    shop,
    code,
    productItems: [{
      product: {_id, price}
      quantity
    }]
  }
   * @param client
   * @param isConfirm
   * @returns
   */
  async applyDiscount(body: any, client: IAuthUser, isConfirm: boolean) {
    const { code, shop, productItems } = body;
    //find discount by code
    const foundDiscount = await this.discountsRepo.findDiscountByQueryRaw({ code, shop });
    if (!foundDiscount)
      throw new NotFoundException(notFoundMessage('discount'));
    //check
    const { isValid, endDate, applyMax, applyMaxPerClient, appliedClients, minPurchaseValue,
      applyTo, specificProducts, type, value, _id } = foundDiscount;
    if (!isValid)
      throw new BadRequestException('Discount hết hạn');
    if (!isGreaterThanToday([endDate]))
      throw new BadRequestException('Discount hết hạn');
    if (!(applyMax > 0))
      throw new BadRequestException('Discount đã hết số lượng');
    if (!(applyMaxPerClient > appliedClients.filter(item => item.toString() === client.id.toString()).length))
      throw new BadRequestException('Bạn đã dùng hết lượng Discount của mình');
    if (applyTo === DiscountApplyTo.SPECIFIC) {
      const productIds = productItems.map(productItem => productItem.product._id)
      if (!(productIds.some(productId => specificProducts.includes(productId))))
        throw new BadRequestException('Discount không áp dụng trên những sản phẩm này')
    }
    //compute total order
    const totalPrice = productItems.reduce((acc, productItem) => {
      acc += (productItem.product.price * productItem.quantity);
      return acc;
    }, 0);
    if (!(minPurchaseValue <= totalPrice))
      throw new BadRequestException(`Đơn hàng cần tối thiểu ${minPurchaseValue}`);
    //compute discount amount //todo: tạo trigger cập nhật valid
    const amount = type === DiscountType.FIXED_AMOUNT ? value : totalPrice * value / 100;
    //review or confirm discount
    if (isConfirm === true) {
      const updatedDiscount = await this.discountsRepo.updateDiscountByQuery({
        isValid: applyMax - 1 > 0 ? true : false,
        $inc: { applyMax: -1, appliedCount: 1 },
        $push: { appliedClients: client.id }
      }, { _id, code, applyMax: { $gt: 0 } });

      if (!updatedDiscount)
        throw new NotFoundException(notFoundMessage('discount'));
    }

    return {
      totalPrice,
      totalDiscount: amount,
      totalCheckout: totalPrice - amount
    };
  }
  // apply without exception
  /*
 * @param body: {
  shop,
  code,
  productItems: [{
    product: {_id, price}
    quantity
  }]
}
 * @param client
 * @param isConfirm
 * @returns
 */
  async applyDiscountV2(body: any, client: IAuthUser, isConfirm: boolean) {
    const { code, shop, productItems } = body;
    //find discount by code
    const foundDiscount = await this.discountsRepo.findDiscountByQueryRaw({ code, shop });
    if (!foundDiscount)
      return null;
    //check
    const { isValid, endDate, applyMax, applyMaxPerClient, appliedClients, minPurchaseValue,
      applyTo, specificProducts, type, value, _id } = foundDiscount;
    if (!isValid)
      return null;
    if (!isGreaterThanToday([endDate]))
      return null;
    if (!(applyMax > 0))
      return null
    if (!(applyMaxPerClient > appliedClients.filter(item => item.toString() === client.id.toString()).length))
      return null;
    if (applyTo === DiscountApplyTo.SPECIFIC) {
      const productIds = productItems.map(productItem => productItem.product._id)
      if (!(productIds.some(productId => specificProducts.includes(productId))))
        return null;
    }
    //compute total order
    const totalPrice = productItems.reduce((acc, productItem) => {
      acc += (productItem.product.price * productItem.quantity);
      return acc;
    }, 0);
    if (!(minPurchaseValue <= totalPrice))
      return null;
    //compute discount amount //todo: tạo trigger cập nhật valid
    const amount = type === DiscountType.FIXED_AMOUNT ? value : totalPrice * value / 100;
    //review or confirm discount
    if (isConfirm === true) {
      const updatedDiscount = await this.discountsRepo.updateDiscountByQuery({
        isValid: applyMax - 1 > 0 ? true : false,
        $inc: { applyMax: -1, appliedCount: 1 },
        $push: { appliedClients: client.id }
      }, { _id, code, applyMax: { $gt: 0 } });

      if (!updatedDiscount)
        return null;
    }

    return 'OK';
  }
  // apply without exception
  /*
 * @param body: {
  shop,
  code,
  productItems: [{
    product: {_id, price}
    quantity
  }]
}
 * @param client
 * @param isConfirm
 * @returns
 */
  async applyDiscountV3(body: any, client: IAuthUser, isConfirm: boolean) {
    const { code, shop, productItems } = body;
    let isApplyDiscount = true;
    let errorDiscount = "";
    //find discount by code
    const foundDiscount = await this.discountsRepo.findDiscountByQueryRaw({ code, shop });
    if (!foundDiscount) {
      errorDiscount = 'Discount không tìm thấy';
      isApplyDiscount = false;
    }
    //check
    const { isValid, endDate, applyMax, applyMaxPerClient, appliedClients, minPurchaseValue,
      applyTo, specificProducts, type, value, _id } = foundDiscount;
    if (!isValid) {
      errorDiscount = 'Discount hết hạn';
      isApplyDiscount = false;
    }
    if (!isGreaterThanToday([endDate])) {
      errorDiscount = 'Discount hết hạn';
      isApplyDiscount = false;
    }
    if (!(applyMax > 0)) {
      errorDiscount = 'Discount đã hết số lượng';
      isApplyDiscount = false;
    }
    if (!(applyMaxPerClient > appliedClients.filter(item => item.toString() === client.id.toString()).length)) {
      errorDiscount = 'Bạn đã dùng hết lượng Discount của mình';
      isApplyDiscount = false;
    }
    if (applyTo === DiscountApplyTo.SPECIFIC) {
      const productIds = productItems.map(productItem => productItem.product._id)
      if (!(productIds.some(productId => specificProducts.includes(productId)))) {
        errorDiscount = 'Discount không áp dụng trên những sản phẩm này';
        isApplyDiscount = false;
      }
    }
    //compute total order
    const totalPrice = productItems.reduce((acc, productItem) => {
      acc += (productItem.product.price * productItem.quantity);
      return acc;
    }, 0);
    if (!(minPurchaseValue <= totalPrice)) {
      errorDiscount = `Đơn hàng cần tối thiểu ${minPurchaseValue}`;
      isApplyDiscount = false;
    }
    //compute discount amount //todo: tạo trigger cập nhật valid
    let amount = 0;
    if (isApplyDiscount === true) {
      amount = type === DiscountType.FIXED_AMOUNT ? value : totalPrice * value / 100;
      //review or confirm discount
      if (isConfirm === true && isApplyDiscount === true) {
        const updatedDiscount = await this.discountsRepo.updateDiscountByQuery({
          isValid: applyMax - 1 > 0 ? true : false,
          $inc: { applyMax: -1, appliedCount: 1 },
          $push: { appliedClients: client.id }
        }, { _id, code, applyMax: { $gt: 0 } });

        if (!updatedDiscount) {
          errorDiscount = `Discount không tìm thấy`;
          isApplyDiscount = false;
        }
      }
    }

    return {
      totalPrice,
      totalDiscount: amount,
      totalCheckout: totalPrice - amount,
      isApplyDiscount,
      errorDiscount
    };
  }
  //
  async cancelDiscount(code: string, user: IAuthUser) {
    //find discount
    const foundDiscount = await this.discountsRepo.findDiscountByQueryRaw({ code });
    if (!foundDiscount)
      throw new NotFoundException(notFoundMessage('discount'));
    //pull client
    const { id: clientId } = user;
    let { appliedClients, _id } = foundDiscount;
    let pulledCount = 0;
    appliedClients = appliedClients.map((item) => {
      if (item.toString() === clientId.toString() && pulledCount === 0) {
        pulledCount = 1;
        return null;
      }
      return item;
    });
    if (!pulledCount)
      throw new NotFoundException('Client chưa áp discount này');
    appliedClients = appliedClients.filter(Boolean);
    //update discount
    const updatedDiscount = await this.discountsRepo.updateDiscountByQuery({
      isValid: true,
      appliedClients,
      $inc: { applyMax: 1, appliedCount: -1 }
    }, { _id, code, appliedCount: { $gt: 0 } });
    if (!updatedDiscount)
      throw new NotFoundException(notFoundMessage('discount'));
    return updatedDiscount;
  }
  //QUERY ALL//
  /**
   *
   * @param query any
   * @param isValid IsValidEnum
   * @param forUser GroupUserEnum: ADMIN | SELLER + auth user | CLIENT + query shop
   * @param user IAuthUser ()
   * @returns Promise<Result<DiscountDoc>>
   */
  async findDiscountsIsValid(
    { page = 1, limit = 24, sort = SortEnum.LATEST, ...query }: DiscountQuery, isValid = IsValidEnum.VALID,
    forUser = GroupUserEnum.ADMIN, user: IAuthUser = null
  ): Promise<Result<DiscountDoc>> {
    const newQuery =
      forUser === GroupUserEnum.ADMIN
        ? { ...query, ...buildQueryLike(['name'], [query.name]), isValid }
        : forUser === GroupUserEnum.SELLER
          ? { ...query, ...buildQueryLike(['name'], [query.name]), isValid, seller: user?.id }
          : forUser === GroupUserEnum.CLIENT
            ? { ...query, ...buildQueryLike(['name'], [query.name]), isValid, shop: query?.shop || null } : null;
    const select = ['_id', 'name', 'code', 'type', 'value', 'startDate', 'endDate', 'applyMax', 'applyTo', 'appliedCount', 'minPurchaseValue'];
    const { data, metadata } = await this.discountsRepo.findDiscountsByQuery(page, limit, sort, newQuery, select);
    const { items, pages } = computeItemsAndPages(metadata, limit);
    return { data, metadata: { page, limit, items, pages } };
  }
  //
  async findProductsByDiscountCode(
    { page = 1, limit = 24, sort = ProductSortEnum.CTIME, ...query }: any
  ) {
    //find a valid discount code
    const foundDiscount = await this.discountsRepo.findDiscountByQueryRaw(
      { code: query?.code || null, isValid: true }, ['shop', 'applyTo', 'specificProducts']
    );
    if (!foundDiscount)
      throw new NotFoundException(notFoundMessage('discount code'));
    //find all product by discount shop
    const { shop: shopId, applyTo, specificProducts: specificProductIds } = foundDiscount;
    let productPage: Result<ProductDocument> = { metadata: { items: 0, pages: 0, page, limit }, data: [] };
    //case ApplyTo.ALL
    if (applyTo === DiscountApplyTo.ALL) {
      productPage = await this.productsService.findAllForSales({ page, limit, sort, shop: shopId });
    }
    //case ApplyTo.SPECIFIC
    if (applyTo === DiscountApplyTo.SPECIFIC) {
      productPage = await this.productsService.findAllForSales({ page, limit, sort, _id: { $in: specificProductIds } });
    }
    return productPage;
  }
  //QUERY ONE//
  async findDiscount(
    discountId: IKey, forUser = GroupUserEnum.ADMIN, user: IAuthUser = null
  ): Promise<Discount> {
    const query =
      forUser === GroupUserEnum.ADMIN ? { _id: discountId }
        : forUser === GroupUserEnum.SELLER ? { _id: discountId, seller: user?.id }
          : forUser === GroupUserEnum.CLIENT ? { _id: discountId, isValid: true } : null; //luôn đúng
    const unselect = ['appliedClients', 'createdAt', 'updatedAt', 'isDeleted', 'deletedAt', '__v'];
    const references: IReference[] = [
      { attribute: 'shop', select: ['_id', 'name', 'isActive'] },
      { attribute: 'seller', select: ['_id', 'name', 'isActive'] },
      { attribute: 'specificProducts', select: ['_id', 'name', 'isPublished', 'isActive'] }
    ];
    const found = await this.discountsRepo.findDiscountByQueryRefer(
      query, unselect, IsSelectEnum.UNSELECT, references);
    if (!found) throw new NotFoundException(notFoundIdMessage('discountId', discountId));
    return found;
  }
}
