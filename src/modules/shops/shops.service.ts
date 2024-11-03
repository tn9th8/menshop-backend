import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { ShopsRepository } from './shops.repository';
import { IAuthUser } from 'src/common/interfaces/auth-user.interface';
import { UsersRepository } from '../users/users.repository';
import { CreateShopTransform } from './transform/create-shop.transform';
import { UpdateShopTransform } from './transform/update-shop.transform';
import { GroupUserEnum, IsActiveEnum, IsSelectEnum, SortEnum } from 'src/common/enums/index.enum';
import { IKey, IReference } from 'src/common/interfaces/index.interface';
import { createErrorMessage, isExistMessage, notFoundIdMessage, notFoundMessage } from 'src/common/utils/exception.util';
import { QueryShopDto } from './dto/query-shop.dto';
import { computeItemsAndPages, toObjetId } from 'src/common/utils/mongo.util';
import { ShopDoc } from './schemas/shop.schema';
import { unselectConst } from 'src/common/constant/index.const';

@Injectable()
export class ShopsService {
  constructor(
    private readonly shopsRepo: ShopsRepository,
    private readonly usersRepo: UsersRepository,
    private readonly createShopTransform: CreateShopTransform,
    private readonly updateShopTransform: UpdateShopTransform,
  ) { }

  //CREATE//
  async create(body: CreateShopDto, seller: IAuthUser) {
    body = await this.createShopTransform.transform(body);
    const { name, description, image } = body;
    if (await this.shopsRepo.isExistByQuery({ seller: seller.id })) {
      throw new ConflictException(isExistMessage('seller'));
    }
    const entity = { name, description, image, seller: seller.id };
    const created = await this.shopsRepo.createShop(entity);
    if (!created)
      throw new BadRequestException(createErrorMessage('shop'));
    return created;
  }

  //UPDATE//
  async update(payload: UpdateShopDto, seller: IAuthUser) {
    const { id: shopId, name, description, image } = await this.updateShopTransform.transform(payload);
    const query = { _id: shopId, seller: seller.id }
    const updated = await this.shopsRepo.updateOneByQuery({ name, description, image }, query);
    if (!updated)
      throw new NotFoundException(notFoundMessage('shop'));
    return updated;
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
    { page = 1, limit = 24, sort = SortEnum.LATEST, ...query }: QueryShopDto,
    isActive: IsActiveEnum
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

  async findOneById(shopId: IKey, group: GroupUserEnum) {
    const query = group === GroupUserEnum.ADMIN ? { _id: shopId } : { _id: shopId, isActive: true };
    const refers: IReference[] = [{ attribute: 'seller', select: ['_id', 'name', 'email', 'phone'] }];
    const found = await this.shopsRepo.findShopByQueryRefer(query, unselectConst, IsSelectEnum.UNSELECT, refers);
    if (!found)
      throw new NotFoundException(notFoundMessage('shop'));
    return found;
  }

  async findOwnShop(seller: IAuthUser) {
    const select = [];
    const query = { seller: seller.id };
    const found = await this.shopsRepo.findOneByQuerySelect(query, select);
    if (!found)
      throw new NotFoundException(notFoundMessage('shop by seller'));
    return found;
  }

  //update version of findShopIdBySeller
  async findShopIdBySeller(sellerId: IKey): Promise<IKey> {
    const select = ['_id'];
    const query = { seller: sellerId };
    const found = await this.shopsRepo.findOneByQuerySelect(query, select);
    if (!found)
      throw new NotFoundException(notFoundMessage('shop by seller'));
    return found._id;
  }

}
