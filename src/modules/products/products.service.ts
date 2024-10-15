import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './products.repository';
import { IProduct } from './schemas/product.schema';
import { ProductsFactory } from './factory/products.factory';
import { Types } from 'mongoose';
import { isObjetId } from 'src/common/utils/mongo.util';

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
  async findAllIsPublishedOrDraft(shop: Types.ObjectId, isPublished: boolean, limit: number = 60, skip: number = 0): Promise<IProduct[]> {
    //todo: metadata
    let query = {};
    if (shop) {
      query = { ...query, shop };
    }
    query = { ...query, isPublished };
    const result = await this.productsRepository.findAllIsPublishedOrDraft(query, limit, skip);
    return result;
  }
  // END QUERY//

  //UPDATE//
  async publishOrUnpublishOne(shop: Types.ObjectId, id: Types.ObjectId, isPublished: boolean) {
    //check is objectId
    if (!isObjetId(id)) {
      throw new BadRequestException(`product id nên là một objectId, id: ${id}`);
    }
    //check is exist id
    const foundDoc = await this.productsRepository.findByIdAndShop(id, shop);
    if (!foundDoc) {
      throw new BadRequestException(`product id không tìm thấy, id: ${id}`);
    }
    //update
    const partialDoc = { isPublished };
    const modifiedCount = await this.productsRepository.updateById(id, partialDoc);
    if (!modifiedCount) {
      throw new BadRequestException(`update product không thành công, id: ${id}`);
    }
    return { modifiedCount };
  }
  //END UPDATE//
}
