import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { SortEnum } from 'src/common/enums/index.enum';
import { ProductSortEnum } from 'src/common/enums/product.enum';
import { IKey, IReference } from 'src/common/interfaces/index.interface';
import { IDbSort } from 'src/common/interfaces/mongo.interface';
import { Result } from 'src/common/interfaces/response.interface';
import { toDbLikeQuery, toDbSelect, toDbUnselect } from 'src/common/utils/mongo.util';
import { CreateProductDto } from './dto/create-product.dto';
import { IQueryProduct } from './dto/query-product.dto';
import { IProduct, Product } from './schemas/product.schema';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: SoftDeleteModel<IProduct>
  ) { }

  //EXIST// the exists method return {_id} | null
  async isExistById(needId: IKey) {
    const isExist = await this.productModel.exists({ _id: needId });
    return isExist ? true : false;
  }

  async isExistByQuery(query: any) {
    const isExist = await this.productModel.exists(query);
    return isExist ? true : false;
  }

  async isExistByQueryAndExcludeId(query: any, id: IKey) {
    const isExist = await this.productModel.exists({
      ...query,
      _id: { $ne: id } //exclude the id document
    });
    return isExist ? true : false;
  }

  //CREATE//
  async createOne(payload: Product) {
    const result = await this.productModel.create(payload);
    return result;
  }
  //END CREATE//

  //UPDATE//
  async updateOneByQuery(
    payload: UpdateQuery<any>,
    query: FilterQuery<any>,
    isNew: boolean = true
  ): Promise<IProduct | null> {
    const options: QueryOptions = { new: isNew };
    const updatedProduct = await this.productModel.findOneAndUpdate(query, payload, options) || null;
    return updatedProduct;
  }
  //END UPDATE//

  //QUERY//
  async findAllByQuery(
    page: number,
    limit: number,
    sort: SortEnum,
    unselect: string[],
    query: IQueryProduct
  ): Promise<Result<IProduct>> {
    const dbQuery = {
      ...query,
      ...toDbLikeQuery(['name'], [query.name])
    }
    const dbUnselect = toDbUnselect(unselect);
    const dbSort: IDbSort =
      sort == SortEnum.LATEST ? { updatedAt: -1 }
        : sort == SortEnum.OLDEST ? { updatedAt: 1 }
          : sort == SortEnum.NAME_AZ ? { name: 1 }
            : sort == SortEnum.NAME_ZA ? { name: -1 }
              : { updatedAt: -1 } //default SortEnum.LATEST
    const skip = limit * (page - 1);

    const [queriedCount, data] = await Promise.all([
      this.productModel.countDocuments(dbQuery),
      this.productModel.find(dbQuery)
        .select(dbUnselect)
        .sort(dbSort)
        .skip(skip)
        .limit(limit)
        .exec()
    ]);

    return {
      metadata: { queriedCount },
      data: (data as any)
    }
  }

  async findAllValid(
    page: number,
    limit: number,
    sort: ProductSortEnum,
    unselect: string[],
    query: IQueryProduct
  ): Promise<Result<IProduct>> {
    const dbQuery = {
      ...query,
      ...toDbLikeQuery(['name'], [query.name])
    }
    const dbUnselect = toDbUnselect(unselect);
    //sort
    const dbSort: IDbSort =
      sort == ProductSortEnum.CTIME ? { updatedAt: -1 }
        : sort == ProductSortEnum.RELEVANT ? { updatedAt: -1 }
          : sort == ProductSortEnum.SALES ? { updatedAt: -1 }
            : sort == ProductSortEnum.POPULATE ? { updatedAt: -1 }
              : { updatedAt: -1 };
    const skip = limit * (page - 1);

    const [queriedCount, data] = await Promise.all([
      this.productModel.countDocuments(dbQuery),
      this.productModel.find(dbQuery)
        .select(dbUnselect)
        .sort(dbSort)
        .skip(skip)
        .limit(limit)
        .exec()
    ]);

    return {
      metadata: { queriedCount },
      data: (data as any)
    }
  }

  async searchAll(
    limit: number,
    page: number,
    sort: ProductSortEnum,
    query: FilterQuery<any>,
    keyword: string,
    selectArr: string[]
  ): Promise<Result<IProduct>> {
    //search, score
    let fullTextSearch = {};
    let score: {};
    if (keyword) {
      fullTextSearch = { $text: { $search: keyword } };
      score = { $meta: 'textScore' };
    } else {
      fullTextSearch = {};
      score = null;
    }
    //sort
    const dbSort: IDbSort =
      sort == ProductSortEnum.CTIME ? { updatedAt: -1 }
        : sort == ProductSortEnum.RELEVANT ? { updatedAt: -1 }
          : sort == ProductSortEnum.SALES ? { updatedAt: -1 }
            : sort == ProductSortEnum.POPULATE ? { updatedAt: -1 }
              : { updatedAt: -1 };
    //skip, query, select
    const skip = limit * (page - 1);
    const { categories, needs, ...newQuery } = query;
    const inCategories = categories ? { categories: { $elemMatch: { $eq: categories } } } : {}; //!falsy: ?: || if() - falsy: if(!!)
    const inNeeds = needs ? { categories: { $elemMatch: { $eq: needs } } } : {};
    const select = toDbSelect(selectArr);

    const [{ data, metadata }] = await this.productModel.aggregate([
      {
        $match: {
          ...newQuery,
          ...inCategories,
          ...inNeeds,
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
            { $count: "queriedCount" },
          ],
          data: [
            { $sort: dbSort },
            { $skip: skip },
            { $limit: limit }
          ]
        }
      }
    ]);
    return {
      metadata: { queriedCount: metadata[0]?.queriedCount ?? 0 },
      data: (data as any)
    }
  }

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

  async findOneById(
    productId: IKey,
    unselect: string[],
    references: IReference[]
  ) {
    const found = await this.productModel.findById(productId)
      .select(toDbUnselect(unselect))
      .populate({
        path: references[0].attribute,
        select: toDbSelect(references[0].select)
      })
      .populate({
        path: references[1].attribute,
        select: toDbSelect(references[1].select)
      })
      .populate({
        path: references[2].attribute,
        select: toDbSelect(references[2].select)
      })
      .populate({
        path: references[3].attribute,
        select: toDbSelect(references[3].select)
      });
    return found || null;
  }

  async findOneByQuery(
    query: FilterQuery<any>,
    unselect: string[],
    references: IReference[]
  ) {
    const found = await this.productModel.findOne(query)
      .select(toDbUnselect(unselect))
      .populate({
        path: references[0].attribute,
        select: toDbSelect(references[0].select)
      })
      .populate({
        path: references[1].attribute,
        select: toDbSelect(references[1].select)
      })
      .populate({
        path: references[2].attribute,
        select: toDbSelect(references[2].select)
      })
      .populate({
        path: references[3].attribute,
        select: toDbSelect(references[3].select)
      });
    return found || null;
  }
}
