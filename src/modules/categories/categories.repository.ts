import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, FilterQuery, Types } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CategoryLevelEnum } from 'src/common/enums/category.enum';
import { CategorySortEnum } from 'src/common/enums/query.enum';
import { MongoPage, MongoSort } from 'src/common/interfaces/mongo.interface';
import { IUpdateResult } from 'src/common/interfaces/persist-result.interface';
import { convertUnselectAttrs } from 'src/common/utils/mongo.util';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category, ICategory } from './schemas/category.schema';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: SoftDeleteModel<ICategory>
  ) { }

  //CREATE//
  async create(createCategoryDto: CreateCategoryDto): Promise<ICategory> {
    const newCate = await this.categoryModel.create(createCategoryDto);
    return newCate;
  }

  //EXIST//
  async isExistNameOrDisplayName(name: string, displayName: string): Promise<boolean> {
    let isExist = await this.categoryModel.exists({ name });
    if (!!isExist) { return true; }
    isExist = await this.categoryModel.exists({ displayName });
    if (!!isExist) { return true; }
    return false;
  }

  async isExistId(id: Types.ObjectId) {
    const isExist = await this.categoryModel.exists({ _id: id });
    if (!!isExist) { return true; }
    return false;
  }

  //QUERY
  async findAll(
    page: number, limit: number,
    sort: string,
    unselect: string[],
    query: FilterQuery<ICategory>
  ): Promise<MongoPage<ICategory>> {
    const dbSort: MongoSort = sort === CategorySortEnum.ASC_DISPLAY_NAME
      ? { displayName: 1 }
      : { displayName: -1 };
    const skip = limit * (page - 1);
    const [{ metadata, data }] = await this.categoryModel.aggregate([
      { $match: query },
      { $project: convertUnselectAttrs(unselect) },
      {
        $facet: {
          metadata: [
            { $count: "count" },
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
      metadata: { count: metadata[0]?.count ?? 0 },
      data
    };
  }

  //disable
  async updateById(
    _id: Types.ObjectId,
    partialDoc: Partial<ICategory>,
    session: ClientSession | null = null,
  ): Promise<IUpdateResult> {
    const updateResult = await this.categoryModel.updateOne({ _id }, { ...partialDoc }).session(session);
    return updateResult;
  }

  async findByIdAndLevel(_id: Types.ObjectId, level: CategoryLevelEnum): Promise<ICategory> {
    const doc = await this.categoryModel
      .findOne(({ _id, level }))
      .select({ _id: 1, childCategories: 1, childCollections: 1 });
    return doc;
  }
}
