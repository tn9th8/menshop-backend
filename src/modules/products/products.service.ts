import { BadRequestException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { isObjectIdMessage, notFoundIdMessage } from 'src/common/utils/exception.util';
import { removeNullishAttrs } from 'src/common/utils/index.util';
import { buildQueryByShop, computeTotalItemsAndPages, convertToObjetId } from 'src/common/utils/mongo.util';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsFactory } from './factory/products.factory';
import { ProductsRepository } from './products.repository';
import { IProduct } from './schemas/product.schema';
import { ProductSortEnum } from 'src/common/enums/query.enum';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly productsFactory: ProductsFactory,
  ) { }

  //CREATE//
  async create(createProductDto: CreateProductDto): Promise<IProduct> {
    const { attributes, shop, categories } = createProductDto;
    if (!shop) { throw new BadRequestException(`Invalid Product Shop: ${shop}`) };

    const isValid = this.productsFactory.isValidAttrs(attributes, categories);
    if (!isValid) { throw new BadRequestException('Invalid Product Attributes') };

    const result = await this.productsRepository.create(createProductDto);
    if (!result) { throw new BadRequestException('Create A Product Error'); }
    return result;
  }
  //END CREATE//

  //QUERY//
  async findAllByIsPublished(
    shop: Types.ObjectId,
    isPublished: boolean,
    limit: number = 60, skip: number = 0
  ): Promise<IProduct[]> {
    //todo: metadata
    const query = buildQueryByShop(shop, { isPublished });
    const result = await this.productsRepository.findAllByIsPublished(query, limit, skip);
    return result;
  }

  async searchAll({
    keyword = '',
    category = '',
    page = 1, limit = 50,
    sort = ProductSortEnum.RELEVANT.toString()
  }) {
    const regWord = keyword ? (new RegExp(keyword)).source : ''; //!falsy
    const query = {
      category: convertToObjetId(category),
      isPublished: true
    };
    const select = ['name', 'displayName', 'price', 'discount', 'asset.thumb'];

    const { metadata, result } = await this.productsRepository.searchAll(
      limit, page, sort, query, regWord, select
    );
    const { items, pages } = computeTotalItemsAndPages(metadata, limit);

    return {
      metadata: { page, limit, items, pages },
      result
    };
  }

  findAll({
    category = '',
    page = 1, limit = 50,
    sort = ProductSortEnum.POPULATE.toString()
  }) {
    const query = {
      category: convertToObjetId(category),
      isPublished: true
    };
    const select = ['name', 'displayName', 'price', 'discount', 'asset.thumb'];
    const result = this.productsRepository.findAll(limit, page, sort, query, select);
    return result;
  }

  async findDetail(productId: string) {
    //check is objectId
    const objectId = convertToObjetId(productId);
    if (!objectId) {
      throw new BadRequestException(isObjectIdMessage('id của product', objectId));
    }
    //find
    const filter = { productId: objectId, isPublished: true };
    const unselect = ['__v'];
    const populate = {
      shop: {
        path: 'shop',
        select: ['name'],
        unselect: ['_id']
      },
      categories: {
        path: 'categories',
        select: ['name', 'displayName'],
        unselect: ['__v']
      },
      models: {
        path: 'models',
        select: ['name', 'sku'],
        unselect: ['__v']
      }
    };
    const foundDoc = await this.productsRepository.findDetail(filter, unselect, populate);
    return foundDoc;
  }
  //END QUERY//

  //UPDATE//
  async updateIsPublished(shop: Types.ObjectId, id: string, isPublished: boolean) {
    //check is objectId
    const objectId = convertToObjetId(id);
    if (!objectId) {
      throw new BadRequestException(isObjectIdMessage('id của product', objectId));
    }
    //check is existId
    const query = buildQueryByShop(shop);
    const foundDoc = await this.productsRepository.findByIdAndQuery(objectId, query);
    if (!foundDoc) {
      throw new BadRequestException(notFoundIdMessage('id của product', objectId));
    }
    //update
    const partialDoc = { isPublished };
    const modifiedCount = await this.productsRepository.updateById(objectId, partialDoc);
    return { modifiedCount };
  }

  async updateOne(shopId: Types.ObjectId, payload: UpdateProductDto) {
    payload = removeNullishAttrs(payload);
    const { id: productId, attributes } = payload;
    const query = buildQueryByShop(shopId, { productId });
    const updatedProduct = await this.productsRepository.updateByQuery(query, payload);
    return updatedProduct;
  }
  //END UPDATE//
}
