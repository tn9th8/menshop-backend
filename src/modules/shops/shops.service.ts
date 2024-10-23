import { Injectable } from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { ShopsRepository } from './shops.repository';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';
import { UsersRepository } from '../users/users.repository';
import { CreateShopTransform } from './transform/create-shop.transform';
import { UpdateShopTransform } from './transform/update-shop.transform';

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
    const { _id: userId } = await this.usersRepo.findLeanByQuery({ email: user.email }, ['_id']);
    const newPayload = { ...payload, userId };
    const created = this.shopsRepo.create(newPayload);
    return created;
  }

  //UPDATE//
  async update(payload: UpdateShopDto, user: AuthUserDto) {
    const { id: shopId, ...newPayload } = await this.updateShopTransform.transform(payload);
    const { _id: userId } = await this.usersRepo.findLeanByQuery({ email: user.email }, ['_id'])
    const query = { shopId, userId }
    const created = this.shopsRepo.updateOneByQuery(newPayload, query);
    return created;
  }

  findAll() {
    return `This action returns all shops`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shop`;
  }



  remove(id: number) {
    return `This action removes a #${id} shop`;
  }
}
