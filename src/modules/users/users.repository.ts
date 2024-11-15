import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { SortEnum } from 'src/common/enums/index.enum';
import { IKey } from 'src/common/interfaces/index.interface';
import { Result } from 'src/common/interfaces/response.interface';
import { buildQueryLike, toDbSkip, toDbSort, toDbUnselect } from 'src/common/utils/mongo.util';
import { User, UserDoc } from './schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: SoftDeleteModel<UserDoc>
  ) { }

  async count() {
    const result = await this.userModel.count();
    return result;
  }

  //CREATE//
  async createOne(payload: User): Promise<UserDoc> {
    const created = await this.userModel.create(payload);
    return (created as any)._doc || null;
  }

  //UPDATE//
  async updateOneByQuery(
    payload: any,
    query: any,
    isNew: boolean = true
  ) {
    const dbOptions = { new: isNew };
    const updated = await this.userModel.findOneAndUpdate(query, payload, dbOptions);
    return updated;
  }

  //EXIST//
  async isExistByQuery(query: any) {
    const isExist = await this.userModel.exists(query).lean()
      ? true
      : false;
    return isExist;
  }
  async isExistById(userId: IKey) {
    const isExist = await this.userModel.exists({ _id: userId });
    return isExist ? true : false;
  }

  //QUERY//
  async findOneByQuery(
    query: any, //{email}
  ) {
    const found = await this.userModel.findOne(query).lean();
    return found;
  }

  async findOneById(
    userId: IKey,
    unselect: string[]
  ): Promise<any | null> {
    const found = await this.userModel.findById(userId)
      .select(toDbUnselect(unselect));
    return found || null;
  }

  async findAllByQuery(
    page: number, limit: number, sort: SortEnum, unselect: string[], query: any
  ): Promise<Result<UserDoc>> {
    const dbQuery = { ...query, ...buildQueryLike(['name'], [query.name]) };
    const [queriedCount, data] = await Promise.all([
      this.userModel.countDocuments(dbQuery),
      this.userModel.find(dbQuery)
        .select(toDbUnselect(unselect))
        .sort(toDbSort(sort))
        .skip(toDbSkip(page, limit))
        .limit(limit)
        .lean()
    ]);
    return {
      metadata: { queriedCount },
      data: (data as any)
    }
  }

  async insertMany(docs: {}[]) {
    await this.userModel.insertMany(docs);
  }



}
