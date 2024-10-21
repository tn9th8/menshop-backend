import { Injectable, NotFoundException } from '@nestjs/common';
import { IsPublishedEnum } from 'src/common/enums/index.enum';
import { NeedSortEnum } from 'src/common/enums/sort.enum';
import { IKey, IReference } from 'src/common/interfaces/index.interface';
import { notFoundIdMessage } from 'src/common/utils/exception.util';
import { computeItemsAndPages } from 'src/common/utils/mongo.util';
import { CreateNeedDto } from './dto/create-need.dto';
import { QueryNeedDto } from './dto/query-need.dto';
import { UpdateNeedDto } from './dto/update-need.dto';
import { NeedsFactory } from './factory/needs.factory';
import { NeedsRepository } from './needs.repository';

@Injectable()
export class NeedsService {
  constructor(
    private readonly needsRepository: NeedsRepository,
    private readonly needsFactory: NeedsFactory,
  ) { }

  //CREATE//
  async createOne(payload: CreateNeedDto) {
    const created = this.needsFactory.createOne(payload);
    return created;
  }

  //UPDATE//
  async updateOne(needId: IKey, payload: UpdateNeedDto) {
    const updated = this.needsFactory.updateOne(needId, payload);
    return updated;
  }

  async updateIsPublished(needId: IKey, isPublished: IsPublishedEnum) {
    const payload = { isPublished: isPublished ? true : false };
    const result = await this.needsRepository.updateById(needId, payload);
    if (!result.updatedCount) {
      throw new NotFoundException(notFoundIdMessage('id param', needId));
    }
    return result;
  }

  //QUERY//
  async findAllByQuery({
    page = 1,
    limit = 24,
    sort = NeedSortEnum.LATEST,
    ...query
  }: QueryNeedDto) {
    const unselect = ['deletedAt', 'isDeleted', '__v'];
    const { data, metadata } = await this.needsRepository.findAllByQuery(
      page, limit, sort, unselect, query
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
        unselect: ['_id']
      },
    ];
    const found = await this.needsRepository.findOneById(needId, unselect, references);
    if (!found) {
      throw new NotFoundException(notFoundIdMessage('id param', needId));
    }
    return found;
  }

}
