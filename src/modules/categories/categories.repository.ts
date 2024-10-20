import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, QueryOptions, Types, UpdateQuery } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CategorySortEnum } from 'src/common/enums/query.enum';
import { IKey, IReference } from 'src/common/interfaces/index.interface';
import { MongoPage, MongoSort } from 'src/common/interfaces/mongo.interface';
import { convertSelectAttrs, convertUnselectAttrs } from 'src/common/utils/mongo.util';
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

  //UPDATE//
  async findOneAndUpdate(
    query: FilterQuery<ICategory>,
    payload: UpdateQuery<ICategory>,
    isNew: boolean = true
  ): Promise<ICategory> {
    query = { _id: query.categoryId };
    const options: QueryOptions = { new: isNew };
    const updatedProduct = await this.categoryModel.findOneAndUpdate(
      query, payload, options
    );
    return updatedProduct;
  }

  async update(
    query: FilterQuery<ICategory>,
    payload: UpdateQuery<ICategory>,
    isNew: boolean = true
  ) {
    query = { _id: query.categoryId };
    const options: QueryOptions = { new: isNew };
    const { modifiedCount } = await this.categoryModel.updateOne(query, payload);
    return { modifiedCount };
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
}
