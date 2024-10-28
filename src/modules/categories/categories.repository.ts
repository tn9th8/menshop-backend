import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, QueryOptions } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { SortEnum } from 'src/common/enums/index.enum';
import { IKey, IReference } from 'src/common/interfaces/index.interface';
import { IDbSort } from 'src/common/interfaces/mongo.interface';
import { Result } from 'src/common/interfaces/response.interface';
import { toDbLikeQuery, toDbSelect, toDbUnselect } from 'src/common/utils/mongo.util';
import { CreateCategoryDto } from './dto/create-category.dto';
import { IQueryCategory } from './dto/query-category.dto';
import { Category, ICategory } from './schemas/category.schema';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: SoftDeleteModel<ICategory>
  ) { }

  //CREATE//
  async createOne(payload: CreateCategoryDto): Promise<ICategory> {
    const created = await this.categoryModel.create(payload);
    return created;
  }

  //UPDATE//
  async updateLeanById(
    categoryId: IKey,
    payload: any
  ) {
    const queryDb: FilterQuery<any> = { _id: categoryId };
    const { modifiedCount } = await this.categoryModel.updateOne(queryDb, payload);
    return { updatedCount: modifiedCount };
  }

  async updateOneById(
    categoryId: IKey,
    payload: any,
    isNew: boolean = true
  ) {
    const dbOptions: QueryOptions = { new: isNew };
    const updated = await this.categoryModel.findByIdAndUpdate(categoryId, payload, dbOptions); //checked categoryId in factory
    return updated;
  }

  //EXIST//
  async isExistById(categoryId: IKey) {
    const isExist = await this.categoryModel.exists({ _id: categoryId });
    return isExist ? true : false;
  }

  async isExistByQuery(query: any) {
    const isExist = await this.categoryModel.exists(query); //null
    return isExist ? true : false;
  }

  async isExistByQueryAndExcludeId(query: any, id: IKey) {
    const isExist = await this.categoryModel.exists({
      ...query,
      _id: { $ne: id } //exclude the id document
    }); //{_id} | null
    return isExist ? true : false;
  }

  //QUERY
  async findLeanById(
    categoryId: IKey,
    select: string[]
  ): Promise<ICategory | null> {
    return await this.categoryModel.findById(categoryId)
      .select(toDbSelect(select));
  }

  async findOneById(
    categoryId: IKey,
    unselect: string[],
    references: IReference[]
  ) {
    const found = await this.categoryModel.findById(categoryId)
      .select(toDbUnselect(unselect))
      .populate({
        path: references[0].attribute,
        select: toDbSelect(references[0].select)
      });
    return found || null;
  }

  async findAllByQuery(
    page: number,
    limit: number,
    sort: SortEnum,
    unselect: string[],
    query: IQueryCategory
  ): Promise<Result<ICategory>> {
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
      this.categoryModel.countDocuments(dbQuery),
      this.categoryModel.find(dbQuery)
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
    query: IQueryCategory,
    select: string[],
    references: IReference[]
  ) {
    const tree = await this.categoryModel.find(query)
      .select(toDbSelect(select))
      .populate({
        path: references[0].attribute,
        select: toDbSelect(references[0].select),
      });
    return tree;
  }
}
