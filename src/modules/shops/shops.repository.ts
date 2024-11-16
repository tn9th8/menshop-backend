import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, QueryOptions } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IsSelectEnum, SortEnum } from 'src/common/enums/index.enum';
import { IDbSort, IKey, IReference } from 'src/common/interfaces/index.interface';
import { Result } from 'src/common/interfaces/response.interface';
import { buildQueryLike, toDbPopulates, toDbSelect, toDbSelectOrUnselect, toDbSkip, toDbSort, toDbUnselect } from 'src/common/utils/mongo.util';
import { IQueryShop } from './dto/query-shop.dto';
import { Shop, ShopDoc, ShopPartial, ShopQuery } from './schemas/shop.schema';

@Injectable()
export class ShopsRepository {
  constructor(
    @InjectModel(Shop.name)
    private readonly shopModel: SoftDeleteModel<ShopDoc>
  ) { }

  //CREATE//
  async createOne(
    document: Shop
  ): Promise<ShopDoc | null> {
    try {
      const { _doc: created } = await this.shopModel.create(document) as any;
      return created;
    } catch (error) {
      console.log('>>> Exception: ShopsRepository: createOne: ' + error);
      return null;
    }
  }

  //UPDATE//
  async updateOneByQuery(
    entity: ShopPartial, query: ShopQuery
  ): Promise<ShopDoc | null> {
    const updated = await this.shopModel.findOneAndUpdate(query, entity, { new: true });
    return updated || null;
  }

  async updateLeanById(
    shopId: IKey,
    payload: any,
    isNew: boolean = true
  ) {
    const dbOptions: QueryOptions = { new: isNew };
    const updated = await this.shopModel.findByIdAndUpdate(shopId, payload, dbOptions);
    return updated ? { updatedCount: 1 } : { updatedCount: 0 };
  }

  //EXIST// the exists method return {_id} | null
  async isExistById(needId: IKey) {
    const isExist = await this.shopModel.exists({ _id: needId });
    return isExist ? true : false;
  }

  async isExistByQuery(query: any) {
    const isExist = await this.shopModel.exists(query);
    return isExist ? true : false;
  }

  async isExistByQueryAndExcludeId(query: any, id: IKey) {
    const isExist = await this.shopModel.exists({
      ...query,
      _id: { $ne: id } //exclude the id document
    });
    return isExist ? true : false;
  }

  //QUERY//
  async findAllByQuery(
    page: number,
    limit: number,
    sort: SortEnum,
    unselect: string[],
    query: IQueryShop
  ): Promise<Result<ShopDoc>> {
    const dbQuery = {
      ...query,
      ...buildQueryLike(['name'], [query.name])
    }

    const [queriedCount, data] = await Promise.all([
      this.shopModel.countDocuments(dbQuery),
      this.shopModel.find(dbQuery)
        .select(toDbUnselect(unselect))
        .sort(toDbSort(sort))
        .skip(toDbSkip(page, limit))
        .limit(limit)
        .exec()
    ]);

    return {
      metadata: { queriedCount },
      data: (data as any)
    }
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
  async findShopByQueryRefer(
    query: any, select: string[], isSelect: IsSelectEnum, refers: IReference[] = []
  ): Promise<ShopDoc | null> {
    const found = await this.shopModel.findOne(query)
      .select(toDbSelectOrUnselect(select, isSelect))
      .populate(toDbPopulates(refers))
      .lean();
    return found || null;
  }

  async findOneByQuerySelect(
    query: any,
    select: string[]
  ): Promise<ShopDoc | null> {
    const found = await this.shopModel.findOne(query)
      .select(toDbSelect(select))
      .lean();
    return found || null;
  }

  //COMPUTE
  async count() {
    const result = await this.shopModel.count();
    return result;
  }

  async insertMany(docs: {}[]) {
    await this.shopModel.insertMany(docs);
  }
}
