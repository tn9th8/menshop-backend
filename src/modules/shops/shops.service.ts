import { Injectable } from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { ShopsRepository } from './shops.repository';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';
import { UsersRepository } from '../users/users.repository';
import { CreateShopTransform } from './transform/create-shop.transform';

@Injectable()
export class ShopsService {
  constructor(
    private readonly shopsRepo: ShopsRepository,
    private readonly usersRepo: UsersRepository,
    private readonly createShopTransform: CreateShopTransform,
  ) { }

  async create(payload: CreateShopDto, user: AuthUserDto) {
    payload = await this.createShopTransform.transform(payload);
    const { _id: shopId } = await this.usersRepo.findLeanByQuery({ email: user.email }, ['_id'])
    const created = this.shopsRepo.create(payload, shopId);
    return created;
  }

  findAll() {
    return `This action returns all shops`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shop`;
  }

  update(id: number, updateShopDto: UpdateShopDto) {
    return `This action updates a #${id} shop`;
  }

  remove(id: number) {
    return `This action removes a #${id} shop`;
  }
}
