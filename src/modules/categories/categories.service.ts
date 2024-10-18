import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import mongoose, { ClientSession } from 'mongoose';
import { AppRepository } from 'src/app.repository';
import { CategoryLevelEnum } from 'src/common/enums/category.enum';
import { Result } from 'src/common/interfaces/response.interface';
import { isObjectIdMessage, notFoundIdMessage } from 'src/common/utils/exception.util';
import { computeTotalItemsAndPages, convertToObjetId } from 'src/common/utils/mongo.util';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ICategory } from './schemas/category.schema';
import { CategorySortEnum, ProductSortEnum } from 'src/common/enums/query.enum';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private readonly appRepository: AppRepository,
  ) { }

  //CREATE//
  async create(
    createCategoryDto: CreateCategoryDto,
    session: ClientSession = null,
  ): Promise<Result<ICategory>> {
    let { name, displayName, level, attributes, specifications, children, brands, variations, needs } = createCategoryDto;
    //check unique name, displayName
    const isExist = await this.categoriesRepository.isExistNameOrDisplayName(name, displayName);
    if (isExist) {
      throw new BadRequestException(`name hoặc displayName đã tồn tại, name: ${name}, displayName: ${displayName}`);
    }
    // attributes, specifications
    if (level !== CategoryLevelEnum.LV1) {
      attributes = specifications = null;
    }
    //children, brands, variations, needs
    let alert = [];
    const validChildren = Promise.all(children.map(async (categoryId) => {
      const objId = convertToObjetId(categoryId);
      if (!objId) {
        alert.push(isObjectIdMessage("itemId trong children", categoryId));
        return;
      }
      const isExist = await this.categoriesRepository.isExistId(objId);
      if (!isExist) {
        alert.push(notFoundIdMessage("itemId trong children", categoryId));
        return;
      }
      return objId;
    }))
    //create
    const newCate = await this.categoriesRepository.create({
      ...createCategoryDto,
      attributes,
      specifications,
      children: await validChildren

    })
    return {
      metadata: alert.length ? { alert } : undefined,
      data: newCate
    };
  }

  async findAll({
    page = 1,
    limit = 24,
    sort = CategorySortEnum.ASC_DISPLAY_NAME.toString(),
    ...query
  }) {
    const unselect = ['deletedAt', 'isDeleted'];
    const { data, metadata } = await this.categoriesRepository.findAll(
      page, limit, sort, unselect, query
    );
    const { items, pages } = computeTotalItemsAndPages(metadata, limit);
    return {
      data,
      metadata: { page, limit, items, pages },
    };
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

  //disable
  async findByIdAndLevel(id: mongoose.Types.ObjectId, level: CategoryLevelEnum): Promise<ICategory> {
    //is objectId
    if (!convertToObjetId(id as any)) {
      throw new BadRequestException(`${CategoryLevelEnum[level].toString().toLowerCase()}Id nên là một objectId: ${id}`);
    }
    //is right level
    const doc = await this.categoriesRepository.findByIdAndLevel(id, level);
    if (!doc) {
      throw new BadRequestException(`${CategoryLevelEnum[level].toString().toLowerCase()}Id không tồn tại hoặc không thuộc level ${level}: ${id}`);
    }
    return doc;
  }
}
