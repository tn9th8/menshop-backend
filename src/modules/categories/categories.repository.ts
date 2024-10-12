import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { ClientSession, Connection } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CategoryTypeEnum } from 'src/common/enums/category.enum';
import { isObjetId } from 'src/common/utils/mongo.util';
import { CreateCategoryDto, IParent } from './dto/create-category.dto';
import { Category, ICategory } from './schemas/category.schema';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: SoftDeleteModel<ICategory>,
    @InjectConnection()
    private readonly connection: Connection,
  ) { }

  async runInsideTransaction<T>(runFunction: (session: ClientSession) => Promise<T>): Promise<T> {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      const result = await runFunction(session);
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
    session: mongoose.ClientSession | null = null
  ): Promise<ICategory[]> {
    const result = await this.categoryModel.create([createCategoryDto], { session });
    return result;
  }

  async pushToParents(
    childId: mongoose.Types.ObjectId, parents: IParent[],
    session: mongoose.ClientSession | null = null
  ): Promise<void> {
    for (const parent of parents) {
      const { id: parentId, type } = parent;
      //check id, objectid
      if (!isObjetId(parentId as any)) { throw new BadRequestException(`Parent id nên là Object id: ${parentId}`); }
      const { childrenBasedShape, childrenBasedNeed } = await this.categoryModel.findOne({ _id: parentId });
      if (!parentId) { throw new NotFoundException(`Không tìm thấy parent với id: ${parentId}`); }
      //push
      switch (type) {
        case CategoryTypeEnum.SHAPE:
          childrenBasedShape.push(childId);
          break;
        case CategoryTypeEnum.NEED:
          childrenBasedShape.push(childId);
          break;
        default:
          throw new BadRequestException(`Parent type không hợp lệ: ${type}`);
      }
      //update
      const updateResult = await this.categoryModel.updateOne({ _id: parentId }, { childrenBasedShape, childrenBasedNeed }).session(session);
      if (updateResult.modifiedCount < 1) { throw new NotFoundException(`Lỗi khi push the child vào parent id: ${parentId}`); }
    }
  }

  async isExistNameOrDisplayName(name: string, displayName: string): Promise<boolean> {
    let isExist: Partial<ICategory> = null;
    isExist = await this.categoryModel.exists({ name });
    if (!!isExist) { return true; }
    isExist = await this.categoryModel.exists({ displayName });
    if (!!isExist) { return true; }
    return false; //convert to boolean
  }
}
