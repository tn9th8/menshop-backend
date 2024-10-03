import { Injectable } from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { ShopsRepo } from './shops.repo';

@Injectable()
export class ShopsService {
  constructor(private readonly shopsRepo: ShopsRepo) { }

  create(createShopDto: CreateShopDto) {
    const result = this.shopsRepo.create(createShopDto);
    return result;
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
