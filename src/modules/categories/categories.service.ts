import { BadRequestException, Injectable } from '@nestjs/common';
import mongoose, { ClientSession } from 'mongoose';
import { AppRepository } from 'src/app.repository';
import { CategoryLevelEnum } from 'src/common/enums/category.enum';
import { CategorySortEnum } from 'src/common/enums/query.enum';
import { IKey, IReference } from 'src/common/interfaces/index.interface';
import { Result } from 'src/common/interfaces/response.interface';
import { isObjectIdMessage, notFoundIdMessage } from 'src/common/utils/exception.util';
import { computeTotalItemsAndPages, convertToObjetId } from 'src/common/utils/mongo.util';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ICategory } from './schemas/category.schema';
import { cleanNullishNestedAttrs } from 'src/common/utils/index.util';

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
    //todo: map return undefined => filter
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

  //UPDATE//
  async update(updateCategoryDto: UpdateCategoryDto) {
    const payload: UpdateCategoryDto = cleanNullishNestedAttrs(updateCategoryDto);
    let { name, displayName, children } = payload;
    //check unique name, displayName
    const isExist = await this.categoriesRepository.isExistNameOrDisplayName(name, displayName);
    if (isExist) {
      throw new BadRequestException(`name hoặc displayName đã tồn tại, name: ${name}, displayName: ${displayName}`);
    }
    //check item is valid in the children array
    const existChildren = await Promise.all(
      children.map(async cateId => {
        const objId = convertToObjetId(cateId);
        if (!objId) return null;
        const isExist = await this.categoriesRepository.isExistId(cateId);
        return isExist ? cateId : null;
      })
    );
    //filter the null items
    const cleanChildren = existChildren.filter(cateId => cateId !== null);
    //todo: check other ref
    const updatedProduct = await this.categoriesRepository.findOneAndUpdate(
      { categoryId: payload.id },
      {
        ...payload,
        children: cleanChildren
      }
    );
    return updatedProduct;
  }

  async updateIsPublished(id: IKey, isPublished: boolean) {
    //update
    const payload = { isPublished };
    const query = { categoryId: id };
    const result = await this.categoriesRepository.update(query, payload);
    return result;
  }


  // QUERY//
  async findAll({
    page = 1,
    limit = 24,
    sort = CategorySortEnum.ASC_DISPLAY_NAME,
    ...query
  }): Promise<Result<ICategory[]>> {
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

  async findOne(id: IKey) {
    const filter = { categoryId: id };
    const unselect = ['__v'];
    const references: IReference[] = [
      {
        attribute: 'children',
        select: ['name'],
        unselect: ['_id']
      },
      // {
      //   attribute: 'brands',
      //   select: ['name'],
      //   unselect: ['__v']
      // },
      // {
      //   attribute: 'needs',
      //   select: ['name'],
      //   unselect: ['__v']
      // },
      // {
      //   attribute: 'variations',
      //   select: ['name'],
      //   unselect: ['__v']
      // }
    ];
    const foundDoc = await this.categoriesRepository.findOne(filter, unselect, references);
    return foundDoc;
  }
}
