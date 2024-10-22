import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, QueryOptions } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { SortEnum } from 'src/common/enums/index.enum';
import { IKey, IReference } from 'src/common/interfaces/index.interface';
import { IDbSort } from 'src/common/interfaces/mongo.interface';
import { Result } from 'src/common/interfaces/response.interface';
import { toDbLikeQuery, toDbSelect, toDbUnselect } from 'src/common/utils/mongo.util';
import { ICategory } from '../categories/schemas/category.schema';
import { CreateNeedDto } from './dto/create-need.dto';
import { QueryNeedDto } from './dto/query-need.dto';
import { UpdateNeedDto } from './dto/update-need.dto';
import { INeed, Need } from './schemas/need.schema';

@Injectable()
export class NeedsRepository {
  constructor(
    @InjectModel(Need.name)
    private readonly needModel: SoftDeleteModel<INeed>
  ) { }
  //CREATE//
  createOne(payload: CreateNeedDto) {
    const created = this.needModel.create(payload);
    return created;
  }

  //UPDATE
  async updateById(
    needId: IKey,
    payload: any
  ) {
    const queryDb: FilterQuery<ICategory> = { _id: needId };
    const { modifiedCount } = await this.needModel.updateOne(queryDb, payload);
    return { updatedCount: modifiedCount };
  }

  async updateOneById(
    needId: IKey,
    payload: any,
    isUpdated: boolean = true
  ) {
    const dbOptions: QueryOptions = { new: isUpdated };
    const updated = await this.needModel.findByIdAndUpdate(needId, payload, dbOptions); //checked needId in factory
    return updated;
  }

  //EXIST
  async isExistById(needId: IKey) {
    const isExist = await this.needModel.exists({ _id: needId });
    if (!!isExist) { return true; }
    return false;
  }

  async isExistByQuery(query: any) {
    const isExist = await this.needModel.exists(query); //null
    return isExist ? true : false;
  }

  async isExistByQueryAndExcludeId(query: any, id: IKey) {
    const isExist = await this.needModel.exists({
      ...query,
      _id: { $ne: id } //exclude the id document
    }); //{_id} | null
    return isExist ? true : false;
  }

  //QUERY//
  async findLeanById(
    needId: IKey,
    select: string[]
  ): Promise<INeed | null> {
    return await this.needModel.findById(needId)
      .select(toDbSelect(select));
  }

  async findOneById(
    needId: IKey,
    unselect: string[],
    references: IReference[]
  ) {
    const found = await this.needModel.findById(needId)
      .select(toDbUnselect(unselect))
      .populate({
        path: references[0].attribute,
        select: {
          ...toDbSelect(references[0].select),
          ...toDbUnselect(references[0].unselect)
        }
      });
    return found || null;
  }

  async findAllByQuery(
    page: number,
    limit: number,
    sort: SortEnum,
    unselect: string[],
    query: QueryNeedDto
  ): Promise<Result<INeed>> {
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
      this.needModel.countDocuments(dbQuery),
      this.needModel.find(dbQuery)
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

  async findTree(
    query: QueryNeedDto,
    select: string[],
    references: IReference[]
  ) {
    const tree = await this.needModel.find(query)
      .select(toDbSelect(select))
      .populate({
        path: references[0].attribute,
        select: toDbSelect(references[0].select),
      });
    return tree;
  }
}