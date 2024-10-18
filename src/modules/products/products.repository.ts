import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, QueryOptions, Types, UpdateQuery, Expression } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { computeSkipAndSort, convertSelectAttrs, convertUnselectAttrs } from 'src/common/utils/mongo.util';
import { CreateProductDto } from './dto/create-product.dto';
import { IProduct, Product } from './schemas/product.schema';

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

  /**
   * find one by id and query
   * @param _id ObjectId
   * @param query FilterQuery<IProduct>
   * @returns a found document or nullish
   */
  async findByIdAndQuery(_id: Types.ObjectId, query: object) {
    const found = await this.productModel.find({ _id, ...query });
    return found;
  }

  async searchAll(
    limit: number, page: number,
    rawSort: string,
    rawQuery: FilterQuery<IProduct>, keyword: string,
    selectArr: string[]
  ) {
    //search, score, sort
    let fullTextSearch = {};
    let score: {};
    let sort: Record<string, 1 | -1 | Expression.Meta>;
    if (!!keyword) {
      //truthy
      fullTextSearch = { $text: { $search: keyword } };
      score = { $meta: 'textScore' };
      sort = rawSort === 'relevant' ? { score: { $meta: 'textScore' } } : { updatedAt: -1 };
    } else {
      //falsy
      fullTextSearch = {};
      score = null;
      sort = { updatedAt: -1 };
    }

    //skip, query, select
    const skip = limit * (page - 1);
    const { category, ...query } = rawQuery;
    const inCategories = category ? { categories: { $elemMatch: { $eq: category } } } : {}; //!falsy: ?: || if() - falsy: if(!!)
    const select = convertSelectAttrs(selectArr);

    const [{ metadata, result }] = await this.productModel.aggregate([
      {
        $match: {
          ...query,
          ...inCategories,
          ...fullTextSearch
        }
      },
      {
        $project: {
          score,
          ...select
        }
      },
      {
        $facet: {
          metadata: [
            { $count: "count" },
          ],
          result: [
            { $sort: sort },
            { $skip: skip },
            { $limit: limit }
          ]
        }
      }
    ]);
    return {
      metadata: { count: metadata[0]?.count ?? 0 }, //!nullish: ?. ??
      result
    }
  }

  async findAll(
    limit: number, page: number,
    rawSort: string,
    rawQuery: FilterQuery<IProduct>,
    selectArr: string[]
  ) {
    //skip, sort
    const { skip, sort } = computeSkipAndSort(limit, page, rawSort);
    //query, select
    const { category, ...query } = rawQuery;
    const inCategories = category ? { categories: { $elemMatch: { $eq: category } } } : {}; //!falsy
    const select = convertSelectAttrs(selectArr);
    const [result] = await this.productModel.aggregate([
      {
        $match: { //step 1: query
          ...query,
          ...inCategories
        }
      },
      { $project: select },  //step 2: select attributes
      {
        $facet: {
          meta: [
            { $count: "count" }, //step 3: count total all items
          ],
          data: [
            { $sort: sort }, //step 4: sort => skip offset => get items for page
            { $skip: skip },
            { $limit: limit }
          ]
        }
      }
    ]);
    const items = result.meta[0].count;
    const pages = Math.ceil(items / limit);
    return {
      metadata: { page, limit, items, pages },
      result: result.data
    };
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
