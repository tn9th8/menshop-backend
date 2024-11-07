import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { IAuthUser } from 'src/common/interfaces/auth-user.interface';
import { GroupUserEnum, IsActiveEnum, IsPublishedEnum, IsSelectEnum, SortEnum } from 'src/common/enums/index.enum';
import { ProductSortEnum } from 'src/common/enums/product.enum';
import { IKey, IReference } from 'src/common/interfaces/index.interface';
import { notFoundIdMessage, notFoundMessage } from 'src/common/utils/exception.util';
import { computeItemsAndPages } from 'src/common/utils/mongo.util';
import { ShopsService } from '../shops/shops.service';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './products.repository';
import { IProduct } from './schemas/product.schema';
import { CreateProductTransform } from './transform/create-product.transform';
import { UpdatedProductTransform } from './transform/update-product.transform';
import { ShopsRepository } from '../shops/shops.repository';
import { InventoriesService } from '../inventories/inventories.service';
import { Result } from 'src/common/interfaces/response.interface';
import { FilterQuery } from 'mongoose';
import { unselectConst } from 'src/common/constant/index.const';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly createProductTransform: CreateProductTransform,
    private readonly updatedProductTransform: UpdatedProductTransform,
    private readonly shopsService: ShopsService,
    private readonly inventoriesService: InventoriesService
  ) { }

  //CREATE//
  async createOne(payload: CreateProductDto, user: IAuthUser): Promise<IProduct> {
    try {
      //create a product
      let { stock, ...productPayload } = await this.createProductTransform.transform(payload);
      const shop = await this.shopsService.findShopIdBySeller(user.id);
      const created = await this.productsRepository.createOne({
        ...productPayload, seller: user.id, shop: shop._id
      });
      if (!created) {
        throw new BadRequestException('Lỗi khi tạo 1 product');
      }
      //created an inventory
      const inventoryPayload = {
        product: created._id,
        shop: shop._id,
        user: user.id,
        stock: payload.stock
      }
      const createdInventory = await this.inventoriesService.createModel(inventoryPayload);
      return created;
    } catch (error) {
      throw error;
    }
  }
  //UPDATE//
  async updateOne(payload: UpdateProductDto, user: IAuthUser) {
    const { id: productId, ...newPayload } = await this.updatedProductTransform.transform(payload);
    const query = { _id: productId, seller: user.id, isActive: true };
    const updated = await this.productsRepository.updateOneByQuery(newPayload, query);
    if (!updated) {
      throw new NotFoundException(notFoundMessage("product"));
    }
    return updated;
  }

  async updateIsActive(productId: IKey, isActive: IsActiveEnum) {
    const payload = {
      isActive: isActive ? true : false,
      isPublished: false
    };
    const query = { _id: productId };
    const updated = await this.productsRepository.updateOneByQuery(payload, query);
    if (!updated) {
      throw new NotFoundException(notFoundIdMessage('productId', productId));
    }
    return updated ? { updatedCount: 1 } : { updatedCount: 0 };
  }

  async updateIsPublished(
    productId: IKey,
    isPublished: IsPublishedEnum,
    user: IAuthUser,
    isActive = IsActiveEnum.ACTIVE
  ) {
    const payload = { isPublished: isPublished ? true : false };
    const query = { _id: productId, seller: user.id, isActive: true };
    const updated = await this.productsRepository.updateOneByQuery(payload, query);
    if (!updated) {
      throw new NotFoundException(notFoundMessage("product"));
    }
    return updated ? { updatedCount: 1 } : { updatedCount: 0 };
  }

  //QUERY//
  async findAllIsActiveByQuery(
    { page = 1, limit = 24, sort = SortEnum.LATEST, ...query }: QueryProductDto,
    isActive = IsActiveEnum.ACTIVE
  ) {
    const { data, metadata } = await this.productsRepository.findAllByQuery(
      page, limit, sort, unselectConst, { ...query, isActive: isActive ? true : false }
    );
    const { items, pages } = computeItemsAndPages(metadata, limit);
    return { data, metadata: { page, limit, items, pages } };
  }

  async findAllIsPublishedByQuery(
    { page = 1, limit = 24, sort = SortEnum.LATEST, ...query }: QueryProductDto,
    isPublished = IsPublishedEnum.PUBLISHED,
    group: GroupUserEnum,
    user?: IAuthUser,
  ) {
    const filter =
      group === GroupUserEnum.ADMIN ?
        { ...query, isPublished: isPublished ? true : false, isActive: true } :
        group === GroupUserEnum.SELLER ?
          { ...query, seller: user.id, isPublished: isPublished ? true : false, isActive: true } :
          { ...query, isPublished: true, isActive: true };//client
    const { data, metadata } = await this.productsRepository.findAllByQuery(
      page, limit, sort, unselectConst, filter);
    const { items, pages } = computeItemsAndPages(metadata, limit);
    return { data, metadata: { page, limit, items, pages } };
  }

  async searchAll(
    { page = 1, limit = 24, sort = ProductSortEnum.CTIME, keyword = '', ...query }: SearchProductDto,
    isPublished = true, isActive = true
  ) {
    const keywordReg = keyword ? (new RegExp(keyword)).source : ''; //!falsy
    const newQuery = { ...query, isPublished, isActive };
    const select = ['name', 'displayName', 'price', 'discount', 'thumb'];

    const { data, metadata } = await this.productsRepository.searchAll(
      limit, page, sort, newQuery, keywordReg, select
    );
    const { items, pages } = computeItemsAndPages(metadata, limit);
    return {
      data,
      metadata: { page, limit, items, pages },
    };
  }

  async findAllForSales(
    { page = 1, limit = 24, sort = ProductSortEnum.CTIME, ...query }: FilterQuery<IProduct>, //client query
    isPublished = true, isActive = true //add query
  ): Promise<Result<IProduct>> {
    const newQuery = { ...query, isPublished, isActive };
    const select = ['_id', 'name', 'thumb', 'price', 'ratingStar'];
    const { data, metadata } = await this.productsRepository.findAllByProductSort(
      page, limit, sort, select, newQuery
    );
    const { items, pages } = computeItemsAndPages(metadata, limit);
    return {
      data, metadata: { page, limit, items, pages },
    };
  }

  async findOneById(productId: IKey, group: GroupUserEnum, user?: IAuthUser) {
    const query =
      group === GroupUserEnum.ADMIN ?
        { _id: productId } :
        group === GroupUserEnum.SELLER ?
          { _id: productId, seller: user.id, isActive: true } :
          { _id: productId, isActive: true };//client
    const refers: IReference[] = [
      { attribute: 'shop', select: ['_id', 'name', 'isMall', 'isActive'] },
      { attribute: 'seller', select: ['_id', 'name', 'role', 'isActive'] },
      { attribute: 'categories', select: ['_id', 'name', 'level', 'isPublished'] },
      // { attribute: 'needs', select: ['_id', 'name', 'level', 'isPublished'] },
    ];
    const found = await this.productsRepository.findProductByQueryRefer(
      query, unselectConst, IsSelectEnum.UNSELECT, refers);
    if (!found)
      throw new NotFoundException(notFoundMessage('product'));
    return found;
  }

  async findOneValidById(productId: IKey, isPublished = true, isActive = true) {
    const query = { _id: productId, isPublished, isActive };
    const refers: IReference[] = [
      { attribute: 'shop', select: ['_id', 'name', 'isMall', 'isActive'] },
      { attribute: 'seller', select: ['_id', 'name', 'role', 'isActive'] },
      { attribute: 'categories', select: ['_id', 'name', 'level', 'isPublished'] },
      // { attribute: 'needs', select: ['_id', 'name', 'level', 'isPublished'] },
    ];
    const found = await this.productsRepository.findOneByQuery(query, unselectConst, refers);
    if (!found) {
      throw new NotFoundException(notFoundMessage('product'));
    }
    return found;
  }
  //END QUERY//

  //QUERY OR OTHER SERVICES//
  /*
  shopId
  productItems: {
    _id,
    price
    quantity,
  }
  */
  async checkProductItem(productItems: any) {
    productItems = await Promise.all(productItems.map(async productItem => {
      const found = await this.productsRepository.findOneByQueryRaw(
        { _id: productItem._id }, ['_id', 'name', 'thumb', 'price']
      );
      if (!found)
        return null;
      return {
        ...found,
        quantity: productItem.quantity
      }
    }));
    return productItems;
  }
}
