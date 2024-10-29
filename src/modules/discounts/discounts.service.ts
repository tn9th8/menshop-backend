import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';
import { DiscountsRepository } from './discounts.repository';
import { createErrorMessage, isExistMessage, notFoundIdMessage, notFoundMessage } from 'src/common/utils/exception.util';
import { ShopsService } from '../shops/shops.service';
import { IKey, IReference } from 'src/common/interfaces/index.interface';
import { DiscountApplyTo } from 'src/common/enums/discount.enum';
import { ProductsService } from '../products/products.service';
import { ProductSortEnum } from 'src/common/enums/product.enum';
import { ForUserEnum, isSelectEnum, IsValidEnum, SortEnum } from 'src/common/enums/index.enum';
import { Discount, DiscountDoc } from './schemas/discount.schema';
import { Result } from 'src/common/interfaces/response.interface';
import { buildQueryExcludeId, buildQueryModelIdSellerId, computeItemsAndPages, toDbLikeQuery } from 'src/common/utils/mongo.util';
import { IProduct } from '../products/schemas/product.schema';

@Injectable()
export class DiscountsService {
  constructor(
    private readonly discountsRepo: DiscountsRepository,
    private readonly shopsService: ShopsService,
    private readonly productsService: ProductsService,
  ) { }

  //CREATE//
  async createDiscountForShop(body: CreateDiscountDto, user: AuthUserDto) {
    const { id: sellerId } = user;
    const {
      name, code, description, type, value, startDate, endDate, minPurchaseValue,
      applyMax, applyMaxPerClient, applyTo, specificProducts } = body;
    //code not exist //note: name not exist, specificProducts is exist
    if (await this.discountsRepo.existDiscountByQuery({ code }))
      throw new ConflictException(isExistMessage('code'));
    //find shopId
    const shopId = await this.shopsService.findShopIdBySeller(sellerId);
    //create discount: case applyTo is all => exclude specificProducts
    let createdDiscount: DiscountDoc;
    const newBody = {
      name, code, description, type, value, startDate, endDate, minPurchaseValue,
      applyMax, applyMaxPerClient, applyTo, shop: shopId, seller: sellerId
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
  async updateDiscountForShop(body: UpdateDiscountDto, user: AuthUserDto) {
    const { id: sellerId } = user;
    const {
      id: discountId, name, code, description, type, value, startDate, endDate, minPurchaseValue,
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
  //QUERY  ALL//
  /**
   * 
   * @param query any
   * @param isValid IsValidEnum
   * @param forUser ForUserEnum: ADMIN | SELLER + auth user | CLIENT + query shop
   * @param user AuthUserDto ()
   * @returns Promise<Result<DiscountDoc>>
   */
  async findDiscountsIsValid(
    { page = 1, limit = 24, sort = SortEnum.LATEST, ...query }: any, isValid = IsValidEnum.VALID,
    forUser = ForUserEnum.ADMIN, user: AuthUserDto = null
  ): Promise<Result<DiscountDoc>> {
    const newQuery =
      forUser === ForUserEnum.ADMIN
        ? { ...query, ...toDbLikeQuery(['name'], [query.name]), isValid }
        : forUser === ForUserEnum.SELLER
          ? { ...query, ...toDbLikeQuery(['name'], [query.name]), isValid, seller: user?.id }
          : forUser === ForUserEnum.CLIENT
            ? { ...query, ...toDbLikeQuery(['name'], [query.name]), isValid, shop: query?.shop || null } : null;
    const select = ['_id', 'name', 'code', 'type', 'value', 'startDate', 'endDate', 'applyMax', 'applyTo', 'appliedCount'];
    const { data, metadata } = await this.discountsRepo.findDiscountsByQuery(page, limit, sort, newQuery, select);
    const { items, pages } = computeItemsAndPages(metadata, limit);
    return { data, metadata: { page, limit, items, pages } };
  }
  async findProductsByDiscountCode(
    { page = 1, limit = 24, sort = ProductSortEnum.CTIME, ...query }
  ) {
    //find a valid discount code
    const foundDiscount = await this.discountsRepo.findDiscountByQuerySelect(
      { code: query?.code || null, isValid: true }, ['shop', 'applyTo', 'specificProducts']
    );
    if (!foundDiscount)
      throw new NotFoundException(notFoundMessage('discount code'));
    //find all product by discount shop
    const { shop: shopId, applyTo, specificProducts: specificProductIds } = foundDiscount;
    let productPage: Result<IProduct> = { metadata: { items: 0, pages: 0, page, limit }, data: [] };
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
  async findDiscountById(
    discountId: IKey, forUser = ForUserEnum.ADMIN, user: AuthUserDto = null
  ): Promise<Discount> {
    const query =
      forUser === ForUserEnum.ADMIN ? { _id: discountId }
        : forUser === ForUserEnum.SELLER ? { _id: discountId, seller: user?.id }
          : forUser === ForUserEnum.CLIENT ? { _id: discountId, isValid: true } : null; //luôn đúng
    const unselect = ['appliedClients', 'createdAt', 'updatedAt', 'isDeleted', 'deletedAt', '__v'];
    const references: IReference[] = [
      { attribute: 'shop', select: ['_id', 'name', 'isActive'] },
      { attribute: 'seller', select: ['_id', 'name', 'isActive'] },
      { attribute: 'specificProducts', select: ['_id', 'name', 'isPublished', 'isActive'] }
    ];
    const found = await this.discountsRepo.findDiscountByQuery(query, isSelectEnum.UNSELECT, unselect, references);
    if (!found) throw new NotFoundException(notFoundIdMessage('discountId', discountId));
    return found;
  }
}
