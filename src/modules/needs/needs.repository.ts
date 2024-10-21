import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { NeedSortEnum } from 'src/common/enums/sort.enum';
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
    sort: NeedSortEnum,
    unselect: string[],
    query: QueryNeedDto
  ): Promise<Result<INeed>> {
    const dbQuery = {
      ...query,
      ...toDbLikeQuery(['name'], [query.name])
    }
    const dbUnselect = toDbUnselect(unselect);
    const dbSort: IDbSort =
      NeedSortEnum.LATEST ? { updatedAt: -1 }
        : NeedSortEnum.OLDEST ? { updatedAt: 1 }
          : NeedSortEnum.NAME_AZ ? { name: 1 }
            : NeedSortEnum.NAME_ZA ? { name: -1 }
              : { updatedAt: -1 } //default NeedSortEnum.LATEST
    const skip = limit * (page - 1);

    const [queriedCount, data] = await Promise.all([
      this.needModel.countDocuments(dbQuery),
      this.needModel.find(dbQuery)
        .select(dbUnselect)
        .skip(skip)
        .limit(limit)
        .sort(dbSort)
        .exec()
    ]);

    return {
      metadata: { queriedCount },
      data: (data as any)
    }

  }

  update(id: number, updateNeedDto: UpdateNeedDto) {
    return `This action updates a #${id} need`;
  }

}
