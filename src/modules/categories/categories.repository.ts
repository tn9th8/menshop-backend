import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, FilterQuery, Types } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CategoryLevelEnum } from 'src/common/enums/category.enum';
import { CategorySortEnum } from 'src/common/enums/query.enum';
import { MongoPage, MongoSort } from 'src/common/interfaces/mongo.interface';
import { IUpdateResult } from 'src/common/interfaces/persist-result.interface';
import { convertSelectAttrs, convertUnselectAttrs } from 'src/common/utils/mongo.util';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category, ICategory } from './schemas/category.schema';
import { IReference } from 'src/common/interfaces/index.interface';

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
    sort: CategorySortEnum,
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

  async findOne(
    filter: FilterQuery<ICategory>,
    unselect: string[],
    references: IReference[]
  ) {
    filter = { _id: filter.categoryId }
    const found = await this.categoryModel.find(filter)
      .select(convertUnselectAttrs(unselect))
      .populate({
        path: references[0].attribute,
        select: {
          ...convertSelectAttrs(references[0].select),
          ...convertUnselectAttrs(references[0].unselect)
        }
      })
    // .populate({
    //   path: references[1].attribute,
    //   select: {
    //     ...convertSelectAttrs(references[1].select),
    //     ...convertUnselectAttrs(references[1].unselect)
    //   }
    // })
    // .populate({
    //   path: references[2].attribute,
    //   select: {
    //     ...convertSelectAttrs(references[2].select),
    //     ...convertUnselectAttrs(references[2].unselect)
    //   }
    // })
    // .populate({
    //   path: references[3].attribute,
    //   select: {
    //     ...convertSelectAttrs(references[3].select),
    //     ...convertUnselectAttrs(references[3].unselect)
    //   }
    // });
    if (!found) {
      return null;
    }
    return found;
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
