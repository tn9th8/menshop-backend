import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { ShopsRepository } from './shops.repository';
import { AuthUserDto } from 'src/shared/auth/dto/auth-user.dto';
import { UsersRepository } from '../users/users.repository';
import { CreateShopTransform } from './transform/create-shop.transform';
import { UpdateShopTransform } from './transform/update-shop.transform';
import { IsActiveEnum, SortEnum } from 'src/common/enums/index.enum';
import { IKey, IReference } from 'src/common/interfaces/index.interface';
import { isExistMessage, notFoundIdMessage } from 'src/common/utils/exception.util';
import { QueryShopDto } from './dto/query-shop.dto';
import { computeItemsAndPages } from 'src/common/utils/mongo.util';
import { IShop } from './schemas/shop.schema';

@Injectable()
export class ShopsService {
  constructor(
    private readonly shopsRepo: ShopsRepository,
    private readonly usersRepo: UsersRepository,
    private readonly createShopTransform: CreateShopTransform,
    private readonly updateShopTransform: UpdateShopTransform,
  ) { }

  //CREATE//
  async create(payload: CreateShopDto, user: AuthUserDto) {
    payload = await this.createShopTransform.transform(payload);
    const { _id: userId } = await this.usersRepo.findOneByQuery({ email: user.email });
    if (await this.shopsRepo.isExistByQuery({ user: userId })) {
      throw new BadRequestException(isExistMessage('seller'));
    }
    const newPayload = { ...payload, userId };
    const created = this.shopsRepo.create(newPayload);
    return created;
  }

  //UPDATE//
  async update(payload: UpdateShopDto, user: AuthUserDto) {
    const { id: shopId, ...newPayload } = await this.updateShopTransform.transform(payload);
    const { _id: userId } = await this.usersRepo.findOneByQuery({ email: user.email })
    const query = { shopId, userId }
    const created = this.shopsRepo.updateOneByQuery(newPayload, query);
    return created;
  }

  async updateIsActive(shopId: IKey, isActive: IsActiveEnum) {
    const payload = { isActive: isActive ? true : false };
    const result = await this.shopsRepo.updateLeanById(shopId, payload);
    if (!result.updatedCount) {
      throw new NotFoundException(notFoundIdMessage('id param', shopId));
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
    }: QueryShopDto,
    isActive = IsActiveEnum.ACTIVE
  ) {
    const unselect = ['deletedAt', 'isDeleted', '__v'];
    const { data, metadata } = await this.shopsRepo.findAllByQuery(
      page, limit, sort, unselect, { ...query, isActive: isActive ? true : false }
    );
    const { items, pages } = computeItemsAndPages(metadata, limit);
    return {
      data,
      metadata: { page, limit, items, pages },
    };
  }

  async findOneById(shopId: IKey) {
    const unselect = ['deletedAt', 'isDeleted', '__v'];
    const references: IReference[] = [{
      attribute: 'user',
      select: ['_id', 'name', 'email', 'phone']
    }];
    const found = await this.shopsRepo.findOneById(shopId, unselect, references);
    if (!found) {
      throw new NotFoundException(notFoundIdMessage('id param', shopId));
    }
    return found;
  }

  async findOneByUser(userId: IKey): Promise<IShop> {
    const select = ['_id'];
    const query = { user: userId };
    const found = await this.shopsRepo.findOneByQuerySelect(query, select);
    if (!found) {
      throw new NotFoundException(notFoundIdMessage('sellerId', userId));
    }
    return found;
  }

  //update version of findOneByUser
  async findShopIdBySeller(sellerId: IKey): Promise<IKey> {
    const select = ['_id'];
    const query = { user: sellerId };
    const found = await this.shopsRepo.findOneByQuerySelect(query, select);
    if (!found)
      throw new NotFoundException(notFoundIdMessage('shop by sellerId', sellerId));
    return found._id;
  }

}
