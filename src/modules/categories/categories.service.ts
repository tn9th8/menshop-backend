import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import mongoose, { ClientSession } from 'mongoose';
import { CategoryDestinationEnum, CategoryLevelEnum } from 'src/common/enums/category.enum';
import { isObjetId } from 'src/common/utils/mongo.util';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ICategory } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) { }

  async createInTran(createCategoryDto: CreateCategoryDto): Promise<ICategory> {
    return this.categoriesRepository.runInsideTransaction<ICategory>(
      (session) => this.create(createCategoryDto, session)
    );
  }

  async create(
    createCategoryDto: CreateCategoryDto,
    session: ClientSession | null = null,
  ): Promise<ICategory> {
    let { name, displayName, level } = createCategoryDto;
    //check unique name
    const isExist = await this.categoriesRepository.isExistNameOrDisplayName(name, displayName);
    if (isExist) {
      throw new BadRequestException(`name hoặc displayName đã tồn tại: ${name}, ${displayName}`);
    }
    //create
    switch (level) {
      case CategoryLevelEnum.PARENT:
        return await this.createParent(createCategoryDto, session);
      case CategoryLevelEnum.CHILD:
        return await this.createChild(createCategoryDto, session);
      default:
        throw new BadRequestException(`level không hợp lệ: ${level}`);
    }
  }

  async createChild(
    createCategoryDto: CreateCategoryDto,
    session: ClientSession | null = null,
  ) {
    //should have parents
    const { parentCategories, parentCollections } = createCategoryDto;
    if (!parentCategories && !parentCollections) {
      throw new BadRequestException(`parentCategories và parentCollections không nên rỗng: ${parentCategories}, ${parentCollections}`);
    }
    //create it
    const createResult = await this.categoriesRepository.create(
      {
        ...createCategoryDto,
        childCategories: undefined, childCollections: undefined, //should not have children
      },
      session,
    );
    if (!createResult._id) {
      throw new BadRequestException('Error creating a category');
    }
    //push it to its parent
    await this.pushToParents(
      createResult._id, parentCategories, CategoryDestinationEnum.CATEGORY, session);
    await this.pushToParents(
      createResult._id, parentCollections, CategoryDestinationEnum.COLLECTION, session);
    return createResult;
  }

  async pushToParents(
    childId: mongoose.Types.ObjectId,
    parentIds: mongoose.Types.ObjectId[],
    destinationAttr: string,
    session: mongoose.ClientSession | null = null
  ): Promise<void> {
    //check not falsy
    if (!parentIds) {
      return;
    }
    //push
    for (const parentId of parentIds) {
      const parentDoc = await this.findByIdAndLevel(parentId, CategoryLevelEnum.PARENT);
      (parentDoc[destinationAttr] as mongoose.Types.ObjectId[]).push(childId);
      const updateResult = await this.categoriesRepository.updateById(
        parentId,
        { [destinationAttr]: parentDoc[destinationAttr] },
        session,
      );
      if (updateResult.modifiedCount < 1) {
        throw new NotFoundException(`Lỗi push vào the parentId: ${parentId}`);
      }
    }
  }

  async createParent(
    createCategoryDto: CreateCategoryDto,
    session: ClientSession | null = null,
  ) {
    //check childIds
    const { childCategories, childCollections } = createCategoryDto;
    await this.isValidChildIds(childCategories);
    await this.isValidChildIds(childCollections);
    //create it
    const createResult = await this.categoriesRepository.create({ ...createCategoryDto }, session);
    return createResult;
  }

  async isValidChildIds(childIds: mongoose.Types.ObjectId[]) {
    //is not falsy
    if (!childIds.length) {
      return true;
    }
    for (const id of childIds) {
      await this.findByIdAndLevel(id, CategoryLevelEnum.CHILD);
    }
    return true;
  }

  async findByIdAndLevel(id: mongoose.Types.ObjectId, level: CategoryLevelEnum): Promise<ICategory> {
    //is objectId
    if (!isObjetId(id as any)) {
      throw new BadRequestException(`${CategoryLevelEnum[level].toString().toLowerCase()}Id nên là một objectId: ${id}`);
    }
    //is right level
    const doc = await this.categoriesRepository.findByIdAndLevel(id, level);
    if (!doc) {
      throw new BadRequestException(`${CategoryLevelEnum[level].toString().toLowerCase()}Id không tồn tại hoặc không thuộc level ${level}: ${id}`);
    }
    return doc;
  }

  findAll() {
    return `This action returns all categories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
