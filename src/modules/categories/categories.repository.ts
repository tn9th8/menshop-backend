import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { ClientSession, Connection } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CategoryLevelEnum } from 'src/common/enums/category.enum';
import { IUpdateResult } from 'src/common/interfaces/persist-result.interface';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category, ICategory } from './schemas/category.schema';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: SoftDeleteModel<ICategory>,
    @InjectConnection()
    private readonly connection: Connection,
  ) { }

  async runInsideTransaction<T>(
    callback: (session: ClientSession) => Promise<T>
  ): Promise<T> {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      const result = await callback(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async create(
    createCategoryDto: CreateCategoryDto,
    session: mongoose.ClientSession | null = null,
  ): Promise<ICategory> {
    const [result] = await this.categoryModel.create([createCategoryDto], { session });
    return result;
  }

  async updateById(
    _id: mongoose.Types.ObjectId,
    partialDoc: Partial<ICategory>,
    session: ClientSession | null = null,
  ): Promise<IUpdateResult> {
    const updateResult = await this.categoryModel.updateOne({ _id }, { ...partialDoc }).session(session);
    return updateResult;
  }

  async isExistNameOrDisplayName(name: string, displayName: string): Promise<boolean> {
    let isExist = await this.categoryModel.exists({ name });
    if (!!isExist) { return true; }
    isExist = await this.categoryModel.exists({ displayName });
    if (!!isExist) { return true; }
    return false;
  }

  async findByIdAndLevel(_id: mongoose.Types.ObjectId, level: CategoryLevelEnum): Promise<ICategory> {
    const doc = await this.categoryModel
      .findOne(({ _id, level }))
      .select({ _id: 1, childCategories: 1, childCollections: 1 });
    return doc;
  }
}
