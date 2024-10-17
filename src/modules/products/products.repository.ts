import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IProduct, Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterQuery, QueryOptions, Types, UpdateQuery } from 'mongoose';
import { convertSelectAttrs, convertUnselectAttrs } from 'src/common/utils/mongo.util';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: SoftDeleteModel<IProduct>
  ) { }
  //CREATE//
  async create(createProductDto: CreateProductDto) {
    const result = await this.productModel.create(createProductDto);
    return result;
  }
  //END CREATE//

  //QUERY//
  async findAllByIsPublished(query: FilterQuery<IProduct>, limit: number, skip: number): Promise<IProduct[]> {
    const result = await this.productModel.find(query)
      .populate('shop', 'name -_id') //email
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
    return result;
  }

  async findByIdAndQuery(_id: Types.ObjectId, query: object) {
    const found = await this.productModel.find({ _id, ...query });
    if (!found) {
      return null;
    }
    return found;
  }

  async searchAll(regexKeyword: RegExp, categories: string[]) {
    //todo u1: cate
    const result = await this.productModel.find(
      {
        isPublished: true,
        $text: { $search: (regexKeyword as any) },
      },
      { score: { $meta: 'textScore' } }, //từ tìm kiếm chính xác nhất
    )
      .sort({ score: { $meta: 'textScore' } })
      .lean()
      .exec();
    return result;
  }

  async findAll(limit: number, page: number, rawSort: string, filter: FilterQuery<IProduct>, selectArr: string[]) {
    const skip = limit * (page - 1);
    const sort = rawSort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const select = convertSelectAttrs(selectArr);
    const result = await this.productModel.find(filter)
      .sort(sort as any) //todo: any
      .skip(skip)
      .limit(limit)
      .select(select)
      .lean()
      .exec()
    return result;
  }

  async findDetail(filter: FilterQuery<IProduct>, unselect: string[], populate: any) {
    const { shop, models, categories } = populate;
    filter = { ...filter, _id: filter.productId }
    const found = await this.productModel.find()
      .select(convertUnselectAttrs(unselect))
      .populate({
        ...shop,
        select: {
          ...convertSelectAttrs(shop.select),
          ...convertUnselectAttrs(shop.unselect)
        }
      })
      .populate({
        ...categories,
        select: {
          ...convertSelectAttrs(categories.select),
          ...convertUnselectAttrs(categories.unselect)
        }
      })
      .populate({
        ...models,
        select: {
          ...convertSelectAttrs(models.select),
          ...convertUnselectAttrs(models.unselect)
        }
      });
    if (!found) {
      return null;
    }
    return found;
  }
  // END QUERY//

  //UPDATE//
  async updateById(productId: Types.ObjectId, payload: UpdateQuery<IProduct>, isNew: boolean = true): Promise<IProduct> {
    const options: QueryOptions = { new: isNew };
    const product = await this.productModel.findByIdAndUpdate(productId, payload, options);
    return product;
  }

  /**
   *
   * @param query : { productId, shopId } => { _id, shop}
   * @param payload : UpdateQuery<IProduct>
   * @param isNew : default true, method will return the result after updated
   * @returns : Promise<IProduct> if found, null if not found
   */
  async updateByQuery(rawQuery: FilterQuery<IProduct>, payload: UpdateQuery<IProduct>, isNew: boolean = true): Promise<IProduct> {
    const options: QueryOptions = { new: isNew };
    let { productId, shopId, ...query } = rawQuery;
    query = {
      ...query,
      _id: query.productId,
      shop: query.shopId
    };
    const updatedProduct = await this.productModel.findOneAndUpdate(query, payload, options);
    return updatedProduct;
  }
  //END UPDATE//
}
