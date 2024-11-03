import { Injectable, NotFoundException } from '@nestjs/common';
import { GroupUserEnum, IsPublishedEnum, IsSelectEnum, SortEnum } from 'src/common/enums/index.enum';
import { IKey, IReference } from 'src/common/interfaces/index.interface';
import { notFoundIdMessage, notFoundMessage } from 'src/common/utils/exception.util';
import { computeItemsAndPages } from 'src/common/utils/mongo.util';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { IUpdateCategory, UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesFactory } from './factory/categories.factory';
import { CreateCategoryTransform } from './transform/create-category.transform';
import { UpdatedCategoryTransform } from './transform/update-category.transform';
import { unselectConst } from 'src/common/constant/index.const';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly catesRepo: CategoriesRepository,
    private readonly categoriesFactory: CategoriesFactory,
    private readonly createCategoryTransform: CreateCategoryTransform,
    private readonly updateCategoryTransform: UpdatedCategoryTransform
  ) { }

  //CREATE//
  async createOne(payload: CreateCategoryDto) {
    payload = await this.createCategoryTransform.transform(payload);
    const created = await this.categoriesFactory.createOne(payload);
    return created;
  }

  //UPDATE//
  async updateOne(payload: UpdateCategoryDto) {
    const newPayload: IUpdateCategory = await this.updateCategoryTransform.transform(payload);
    const updated = await this.categoriesFactory.updateOne(newPayload);
    return updated;
  }

  async updateIsPublished(categoryId: IKey, isPublished = IsPublishedEnum.PUBLISHED) {
    const payload = { isPublished: isPublished ? true : false };
    const result = await this.catesRepo.updateLeanById(categoryId, payload);
    if (!result.updatedCount) {
      throw new NotFoundException(notFoundIdMessage('id param', categoryId));
    }
    return result;
  }

  //QUERY//
  async findAllByQuery(
    { page = 1, limit = 24, sort = SortEnum.LATEST, ...query }: QueryCategoryDto,
    isPublished = IsPublishedEnum.PUBLISHED
  ) {
    const unselect = ['deletedAt', 'isDeleted', '__v'];
    const { data, metadata } = await this.catesRepo.findAllByQuery(
      page, limit, sort, unselect, { ...query, isPublished: isPublished ? true : false }
    );
    const { items, pages } = computeItemsAndPages(metadata, limit);
    return {
      data,
      metadata: { page, limit, items, pages },
    };
  }

  async findOneById(categoryId: IKey, group: GroupUserEnum) {
    const query = group === GroupUserEnum.ADMIN ?
      { _id: categoryId } : { _id: categoryId, isPublished: true };
    const refers: IReference[] = [{
      attribute: 'children',
      select: ['_id', 'name', 'slug', 'level', 'attributes', 'specifications'],
    }];
    const found = await this.catesRepo.findCateByQueryRefer(
      query, unselectConst, IsSelectEnum.UNSELECT, refers);
    if (!found)
      throw new NotFoundException(notFoundMessage('category'));
    return found;
  }

  async findTree(isPublished: IsPublishedEnum = IsPublishedEnum.PUBLISHED) {
    const query = { level: 1, isPublished: isPublished ? true : false };
    const select = ['_id', 'name', 'slug', 'level'];
    const references: IReference[] = [
      {
        attribute: 'children',
        select: ['_id', 'name', 'slug', 'level']
      },
    ];
    const tree = await this.catesRepo.findTree(query, select, references);
    return tree;
  }
}
