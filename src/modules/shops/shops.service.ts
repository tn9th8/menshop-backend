import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { unselectConst } from 'src/common/constant/index.const';
import { GroupUserEnum, IsActiveEnum, IsOpenEnum, IsSelectEnum, SortEnum } from 'src/common/enums/index.enum';
import { IAuthUser } from 'src/common/interfaces/auth-user.interface';
import { IKey, IReference } from 'src/common/interfaces/index.interface';
import { createErrorMessage, isExistMessage, notFoundIdMessage, notFoundMessage } from 'src/common/utils/exception.util';
import { computeItemsAndPages } from 'src/common/utils/mongo.util';
import { QueryShopDto } from './dto/query-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { ShopsRepository } from './shops.repository';
import { CreateShopTransform } from './transform/create-shop.transform';
import { UpdateShopTransform } from './transform/update-shop.transform';
import { ShopDoc } from './schemas/shop.schema';

@Injectable()
export class ShopsService {
  constructor(
    private readonly shopsRepo: ShopsRepository,
    private readonly createShopTransform: CreateShopTransform,
    private readonly updateShopTransform: UpdateShopTransform,
  ) { }

  //CREATE//
  /**
   * @param payload {
   *    name
   *    seller: IKey
   *    avatar
   * }
   * @returns shopDoc
   */
  async createShopForUser(payload: any) {
    if (await this.shopsRepo.isExistByQuery({ seller: payload.seller }))
      throw new ConflictException(isExistMessage('seller'));
    const created = await this.shopsRepo.createOne(payload);
    if (!created)
      throw new BadRequestException(createErrorMessage('shop'));
    return created;
  }

  //UPDATE//
  async update(payload: UpdateShopDto, seller: IAuthUser) {
    const { id: shopId, name, description, image, isOpen } = await this.updateShopTransform.transform(payload);
    const query = { _id: shopId, seller: seller.id }
    const updated = await this.shopsRepo.updateOneByQuery({ name, description, image, isOpen }, query);
    if (!updated)
      throw new NotFoundException(notFoundMessage('shop'));
    return updated;
  }

  async updateIsActive(shopId: IKey, isActive: IsActiveEnum) {
    const payload = { isActive: isActive ? true : false };
    const result = await this.shopsRepo.updateLeanById(shopId, payload);
    if (!result.updatedCount) {
      throw new NotFoundException(notFoundMessage('shop'));
    }
    return result;
  }

  async updateIsOpen(shopId: IKey, isOpen: boolean) {
    const payload = { isOpen: isOpen ? true : false };
    const result = await this.shopsRepo.updateLeanById(shopId, payload);
    if (!result.updatedCount) {
      throw new NotFoundException(notFoundIdMessage('id param', shopId));
    }
    return result;
  }

  //QUERY//
  async findAllByQuery(
    { page = 1, limit = 24, sort = SortEnum.LATEST, ...query }: QueryShopDto,
    isActive?: IsActiveEnum, isOpen?: IsOpenEnum
  ) {
    const unselect = ['deletedAt', 'isDeleted', '__v'];
    const isActiveObj = isActive === 1 ? { isActive: true } : isActive === 0 ? { isActive: false } : {};
    const isOpenObj = isOpen === 1 ? { isOpen: true } : isOpen === 0 ? { isOpen: false } : {};
    const { data, metadata } = await this.shopsRepo.findAllByQuery(
      page, limit, sort, unselect, { ...query, ...isActiveObj, ...isOpenObj }
    );
    const { items, pages } = computeItemsAndPages(metadata, limit);
    return {
      data,
      metadata: { page, limit, items, pages },
    };
  }

  async findOneById(shopId: IKey, group: GroupUserEnum) {
    const query = group === GroupUserEnum.ADMIN ? { _id: shopId } : { _id: shopId, isActive: true, isOpen: true };
    const refers: IReference[] = [{ attribute: 'seller', select: ['_id', 'name', 'email', 'phone'] }];
    const found = await this.shopsRepo.findShopByQueryRefer(query, unselectConst, IsSelectEnum.UNSELECT, refers);
    if (!found)
      throw new NotFoundException(notFoundMessage('shop'));
    return found;
  }

  async findOneRaw(shopId: IKey) {
    const query = { _id: shopId, isActive: true, isOpen: true };
    const found = await this.shopsRepo.findOneByQuerySelect(query, ['_id', 'name']);
    if (!found)
      throw new NotFoundException(notFoundMessage('shop'));
    return found;
  }

  async findOwnShop(seller: IAuthUser): Promise<ShopDoc> {
    const select = [];
    const query = { seller: seller.id };
    const references: IReference[] = [{ attribute: 'seller', select: ['_id', 'name', 'phone', 'email'] }];
    const found = await this.shopsRepo.findShopByQueryRefer(query, select, IsSelectEnum.SELECT, references);
    if (!found)
      throw new NotFoundException(notFoundMessage('shop by seller'));
    return found;
  }

  //update version of findShopBySeller
  async findShopBySeller(sellerId: IKey): Promise<ShopDoc> {
    const select = ['_id'];
    const query = { seller: sellerId };
    const found = await this.shopsRepo.findOneByQuerySelect(query, select);
    if (!found)
      throw new NotFoundException(notFoundMessage('shop by seller'));
    return found
  }

}
