import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNeedDto } from './dto/create-need.dto';
import { UpdateNeedDto } from './dto/update-need.dto';
import { NeedsRepository } from './needs.repository';
import { NeedsFactory } from './factory/needs.factory';
import { IKey } from 'src/common/interfaces/index.interface';
import { notFoundIdMessage } from 'src/common/utils/exception.util';
import { IsPublishedEnum } from 'src/common/enums/index.enum';

@Injectable()
export class NeedsService {
  constructor(
    private readonly needsRepository: NeedsRepository,
    private readonly needsFactory: NeedsFactory,
  ) { }

  //CREATE//
  async create(payload: CreateNeedDto) {
    const created = this.needsFactory.createOne(payload);
    return created;
  }

  //UPDATE//
  async updateIsPublished(needId: IKey, isPublished: IsPublishedEnum) {
    const payload = { isPublished: isPublished ? true : false };
    const result = await this.needsRepository.updateById(needId, payload);
    if (!result.updatedCount) {
      throw new NotFoundException(notFoundIdMessage('id param', needId));
    }
    return result;
  }

  findAll() {
    return `This action returns all needs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} need`;
  }

  update(id: number, updateNeedDto: UpdateNeedDto) {
    return `This action updates a #${id} need`;
  }

  remove(id: number) {
    return `This action removes a #${id} need`;
  }
}
