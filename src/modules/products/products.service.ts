import { BadRequestException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { buildQueryByShop, convertToObjetId } from 'src/common/utils/mongo.util';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsFactory } from './factory/products.factory';
import { ProductsRepository } from './products.repository';
import { IProduct } from './schemas/product.schema';
import { isObjectIdMessage, notFoundIdMessage } from 'src/common/utils/exception.util';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly productsFactory: ProductsFactory,
  ) { }

  async create(createProductDto: CreateProductDto): Promise<IProduct> {
    const { attributes, shop, categories } = createProductDto;
    if (!shop) { throw new BadRequestException(`Invalid Product Shop: ${shop}`) };

    const isValid = this.productsFactory.isValidAttrs(attributes, categories);
    if (!isValid) { throw new BadRequestException('Invalid Product Attributes') };

    const result = await this.productsRepository.create(createProductDto);
    if (!result) { throw new BadRequestException('Create A Product Error'); }
    return result;
  }

  //QUERY//
  async findAllByIsPublished(shop: Types.ObjectId, isPublished: boolean, limit: number = 60, skip: number = 0): Promise<IProduct[]> {
    //todo: metadata
    const xxx = buildQueryByShop(shop);
    const query = buildQueryByShop(shop, { isPublished });
    const result = await this.productsRepository.findAllByIsPublished(query, limit, skip);
    return result;
  }
  //END QUERY//

  //UPDATE//
  async updateIsPublished(shop: Types.ObjectId, id: Types.ObjectId, isPublished: boolean) {
    //check is objectId
    if (!convertToObjetId(id)) {
      throw new BadRequestException(isObjectIdMessage('id của product', id));
    }
    //check is existId
    const query = buildQueryByShop(shop);
    const foundDoc = await this.productsRepository.findByIdAndQuery(id, query);
    if (!foundDoc) {
      throw new BadRequestException(notFoundIdMessage('id của product', id));
    }
    //update
    const partialDoc = { isPublished };
    const modifiedCount = await this.productsRepository.updateById(id, partialDoc);
    return { modifiedCount };
  }
  //END UPDATE//
}
