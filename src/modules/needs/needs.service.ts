import { Injectable, NotFoundException } from '@nestjs/common';
import { IsPublishedEnum, SortEnum } from 'src/common/enums/index.enum';
import { IKey, IReference } from 'src/common/interfaces/index.interface';
import { notFoundIdMessage } from 'src/common/utils/exception.util';
import { computeItemsAndPages } from 'src/common/utils/mongo.util';
import { CreateNeedDto } from './dto/create-need.dto';
import { QueryNeedDto } from './dto/query-need.dto';
import { IUpdateNeed, UpdateNeedDto } from './dto/update-need.dto';
import { NeedsFactory } from './factory/needs.factory';
import { NeedsRepository } from './needs.repository';
import { CreateNeedTransform } from './transform/create-need.transform';
import { UpdateNeedTransform } from './transform/update-need.transform';

@Injectable()
export class NeedsService {
  constructor(
    private readonly needsRepository: NeedsRepository,
    private readonly needsFactory: NeedsFactory,
    private readonly createNeedTransform: CreateNeedTransform,
    private readonly updateNeedTransform: UpdateNeedTransform
  ) { }

  //CREATE//
  async createOne(payload: CreateNeedDto) {
    payload = await this.createNeedTransform.transform(payload);
    const created = await this.needsFactory.createOne(payload);
    return created;
  }

  //UPDATE//
  async updateOne(payload: UpdateNeedDto) {
    const newPayload: IUpdateNeed = await this.updateNeedTransform.transform(payload);
    const updated = await this.needsFactory.updateOne(newPayload);
    return updated;
  }

  async updateIsPublished(needId: IKey, isPublished = IsPublishedEnum.PUBLISHED) {
    const payload = { isPublished: isPublished ? true : false };
    const result = await this.needsRepository.updateLeanById(needId, payload);
    if (!result.updatedCount) {
      throw new NotFoundException(notFoundIdMessage('id param', needId));
    }
    return result;
  }

  //QUERY//
  async findAllByQuery(
    {
      page = 1,
      limit = 24,
      sort = SortEnum.LATEST,
      ...query
    }: QueryNeedDto,
    isPublished = IsPublishedEnum.PUBLISHED
  ) {
    const unselect = ['deletedAt', 'isDeleted', '__v'];
    const { data, metadata } = await this.needsRepository.findAllByQuery(
      page, limit, sort, unselect, { ...query, isPublished: isPublished ? true : false }
    );
    const { items, pages } = computeItemsAndPages(metadata, limit);
    return {
      data,
      metadata: { page, limit, items, pages },
    };
  }

  async findOneById(needId: IKey) {
    const unselect = ['__v'];
    const references: IReference[] = [
      {
        attribute: 'children',
        select: ['_id', 'name', 'slug', 'level'],
      },
    ];
    const found = await this.needsRepository.findOneById(needId, unselect, references);
    if (!found) {
      throw new NotFoundException(notFoundIdMessage('id param', needId));
    }
    return found;
  }

  async findTree(isPublished: IsPublishedEnum = IsPublishedEnum.PUBLISHED) {
    const query = { isPublished: isPublished ? true : false };
    const select = ['_id', 'name', 'slug', 'level'];
    const references: IReference[] = [
      {
        attribute: 'children',
        select: ['_id', 'name', 'slug', 'level']
      },
    ];
    const tree = await this.needsRepository.findTree(query, select, references);
    return tree;
  }

}
