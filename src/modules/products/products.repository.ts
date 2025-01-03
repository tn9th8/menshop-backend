import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IsSelectEnum, SortEnum } from 'src/common/enums/index.enum';
import { ProductSortEnum } from 'src/modules/products/enum/product.enum';
import { IDbSort, IKey, IReference } from 'src/common/interfaces/index.interface';
import { Result } from 'src/common/interfaces/response.interface';
import { buildQueryLike, toDbPopulates, toDbSelect, toDbSelectOrUnselect, toDbSkip, toDbSort, toDbUnselect } from 'src/common/utils/mongo.util';
import { IQueryProduct } from './dto/query-product.dto';
import { ProductsHelper } from './services/products.helper';
import { ProductDocument, Product } from './schemas/product.schema';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: SoftDeleteModel<ProductDocument>,
    private readonly productsHelper: ProductsHelper
  ) { }
  //CREATE//
  async createOne(payload: Product): Promise<ProductDocument | null> {
    try {
      const { _doc: created } = await this.productModel.create(payload);
      return created;
    } catch (error) {
      console.log('>>> Exception: ProductsRepository: createOne: ' + error);
      return null;
    }
  }
  //END CREATE//

  //UPDATE//
  async updateOneByQuery(
    payload: UpdateQuery<any>,
    query: FilterQuery<any>,
    isNew: boolean = true
  ): Promise<ProductDocument | null> {
    const options: QueryOptions = { new: isNew };
    const updatedProduct = await this.productModel.findOneAndUpdate(query, payload, options) || null;
    return updatedProduct;
  }
  //END UPDATE//

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


  //QUERY//
  async findAllByQuery(
    page: number, limit: number, sort: SortEnum, unselect: string[], query: IQueryProduct
  ): Promise<Result<ProductDocument>> {
    const dbQuery = {
      ...query,
      ...buildQueryLike(['name'], [query.name])
    }
    const [{ data, metadata }] = await this.productModel.aggregate([
      { $match: dbQuery },
      {
        $project: {
          name: 1, thumb: 1, variationTiers: 1, price: 1, ratingStar: 1, views: 1, likes: 1, updatedAt: 1
        }
      },
      {
        $lookup: {
          from: "inventories", //collections
          localField: "_id",
          foreignField: "product",
          as: "inventory",
          pipeline: [{ $project: { stock: 1, sold: 1 } }]
        }
      },
      {
        $addFields: {
          sold: { $arrayElemAt: ["$inventory.sold", 0] },
          stock: { $arrayElemAt: ["$inventory.stock", 0] }
        }
      },
      {
        $project: { inventory: 0 }
      },
      {
        $facet: {
          metadata: [{ $count: "queriedCount" },],
          data: [
            { $sort: toDbSort(sort) },
            { $skip: toDbSkip(page, limit) },
            { $limit: limit }
          ]
        }
      }
    ])

    return {
      metadata: { queriedCount: metadata[0]?.queriedCount ?? 0 },
      data: (data as any)
    }

    // const [queriedCount, data] = await Promise.all([
    //   this.productModel.countDocuments(dbQuery),
    //   this.productModel.find(dbQuery)
    //     .select(dbUnselect)
    //     .sort(dbSort)
    //     .skip(skip)
    //     .limit(limit)
    //     .exec()
    // ]);

    // return {
    //   metadata: { queriedCount },
    //   data: (data as any)
    // }
  }

  async findAllByProductSort(
    page: number, limit: number, sort: ProductSortEnum, select: string[], query: IQueryProduct
  ): Promise<Result<ProductDocument>> {
    const dbQuery = {
      ...query,
      ...buildQueryLike(['name'], [query.name])
    }
    const [queriedCount, data] = await Promise.all([
      this.productModel.countDocuments(dbQuery),
      this.productModel.find(dbQuery)
        .select(toDbSelect(select))
        .sort(this.productsHelper.toDbSort(sort))
        .skip(limit * (page - 1))
        .limit(limit)
        .lean()
    ]);
    return {
      data, metadata: { queriedCount }
    }
  }

  async findAllByProductSortV2(
    page: number, limit: number, sort: ProductSortEnum, select: string[], query: IQueryProduct
  ): Promise<Result<ProductDocument>> {
    const dbQuery = {
      ...query,
      ...buildQueryLike(['name'], [query.name])
    }
    const [{ data, metadata }] = await this.productModel.aggregate([
      { $match: dbQuery },
      {
        $project: {
          name: 1, thumb: 1, variationTiers: 1, price: 1, ratingStar: 1, views: 1, likes: 1, updatedAt: 1, shop: 1
        }
      },
      {
        $lookup: {
          from: "inventories", //collections
          localField: "_id",
          foreignField: "product",
          as: "inventory",
          pipeline: [{ $project: { stock: 1, sold: 1 } }]
        }
      },
      {
        $addFields: {
          sold: { $arrayElemAt: ["$inventory.sold", 0] },
          stock: { $arrayElemAt: ["$inventory.stock", 0] }
        }
      },
      {
        $project: { inventory: 0 }
      },
      {
        $facet: {
          metadata: [{ $count: "queriedCount" },],
          data: [
            { $sort: this.productsHelper.toDbSort(sort) },
            { $skip: toDbSkip(page, limit) },
            { $limit: limit }
          ]
        }
      }
    ])

    return {
      metadata: { queriedCount: metadata[0]?.queriedCount ?? 0 },
      data: (data as any)
    }
    // return {
    //   data, metadata: { queriedCount }
    // }
  }

  async searchAll(
    limit: number, page: number, sort: ProductSortEnum, query: any, fullTextSearch: any, select: string[]
  ): Promise<Result<ProductDocument>> {
    //query
    const [{ data, metadata }] = await this.productModel.aggregate([
      { $match: { ...query, ...fullTextSearch.text } },
      { $project: { score: fullTextSearch.score, ...toDbSelect(select) } },
      {
        $lookup: {
          from: "inventories", //collections
          localField: "_id",
          foreignField: "product",
          as: "inventory",
          pipeline: [{ $project: { stock: 1, sold: 1 } }]
        }
      },
      {
        $addFields: {
          sold: { $arrayElemAt: ["$inventory.sold", 0] },
          stock: { $arrayElemAt: ["$inventory.stock", 0] }
        }
      },
      {
        $project: { inventory: 0 }
      },
      {
        $facet: {
          metadata: [{ $count: "queriedCount" },],
          data: [
            { $sort: this.productsHelper.toDbSort(sort) },
            { $skip: toDbSkip(page, limit) },
            { $limit: limit }]
        }
      }
    ]);
    return {
      metadata: { queriedCount: metadata[0]?.queriedCount ?? 0 },
      data: (data as any)
    }
  }

  async findAllByIsPublished(query: FilterQuery<ProductDocument>, limit: number, skip: number): Promise<ProductDocument[]> {
    const result = await this.productModel.find(query)
      .populate('shop', 'name -_id') //email
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
    return result;
  }
  //QUERY ONE//
  /**
   * Tìm kiếm 1 doc đầy đủ với query, select/unselect, refers
   * @param query
   * @param isSelect
   * @param select
   * @param refers
   * @returns
   */
  async findProductByQueryRefer(
    query: any, select: string[], isSelect: IsSelectEnum, refers: IReference[] = []
  ): Promise<Product | null> {
    const found = await this.productModel.findOne(query)
      .select(toDbSelectOrUnselect(select, isSelect))
      .populate(toDbPopulates(refers))
      .lean();
    return found || null;
  }

  /**
 * Tìm kiếm 1 doc ngắn gọn với chỉ query, select
 * @param query
 * @param select
 * @returns
 */
  async findOneByQueryRaw(
    query: any, select: string[] = [] //ko truyen select => select all
  ): Promise<Product | null> {
    const found = await this.productModel.findOne(query)
      .select(toDbSelect(select))
      .lean();
    return found || null;
  }

  async findOneByQuery(
    query: FilterQuery<any>,
    unselect: string[],
    refers: IReference[]
  ) {
    const found = await this.productModel.findOne(query)
      .select(toDbUnselect(unselect))
      .populate(toDbPopulates(refers));
    return found?._doc || null;
  }
}
