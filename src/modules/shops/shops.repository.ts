import { Injectable } from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IShop, Shop } from './schemas/shop.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IKey, IReference } from 'src/common/interfaces/index.interface';
import { FilterQuery, QueryOptions } from 'mongoose';
import { SortEnum } from 'src/common/enums/index.enum';
import { IQueryShop } from './dto/query-shop.dto';
import { Result } from 'src/common/interfaces/response.interface';
import { toDbLikeQuery, toDbSelect, toDbUnselect } from 'src/common/utils/mongo.util';
import { IDbSort } from 'src/common/interfaces/index.interface';

@Injectable()
export class ShopsRepository {
  constructor(
    @InjectModel(Shop.name)
    private readonly shopModel: SoftDeleteModel<IShop>
  ) { }

  //CREATE//
  async create(payload: any): Promise<IShop> {
    const { userId, ...dbPayload } = payload;
    const created = await this.shopModel.create({ ...dbPayload, user: userId });
    return created;
  }

  //UPDATE//
  async updateOneByQuery(
    payload: any,
    query: any,
    isNew: boolean = true
  ) {
    const dbQuery: FilterQuery<any> = { _id: query.shopId, user: query.userId };
    const dbOptions: QueryOptions = { new: isNew };
    const updated = await this.shopModel.findOneAndUpdate(dbQuery, payload, dbOptions);
    return updated;
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
  ): Promise<Result<IShop>> {
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
      this.shopModel.countDocuments(dbQuery),
      this.shopModel.find(dbQuery)
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

  async findOneById(
    needId: IKey,
    unselect: string[],
    references: IReference[]
  ): Promise<IShop | null> {
    const found = await this.shopModel.findById(needId)
      .select(toDbUnselect(unselect))
      .populate({
        path: references[0].attribute,
        select: toDbSelect(references[0].select)
      });
    return found || null;
  }

  async findOneByQuerySelect(
    query: any,
    select: string[]
  ): Promise<IShop | null> {
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
