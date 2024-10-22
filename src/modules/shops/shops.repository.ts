import { Injectable } from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IShop, Shop } from './schemas/shop.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IKey } from 'src/common/interfaces/index.interface';

@Injectable()
export class ShopsRepository {
  constructor(
    @InjectModel(Shop.name)
    private readonly shopModel: SoftDeleteModel<IShop>
  ) { }

  async create(
    payload: CreateShopDto,
    shopId: IKey,
  ): Promise<IShop> {
    const created = await this.shopModel.create({ ...payload, shop: shopId });
    return created;
  }

  //EXIST
  async isExistByQuery(query: any) {
    const isExist = await this.shopModel.exists(query); //{_id} | null
    return isExist ? true : false;
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

  async count() {
    const result = await this.shopModel.count();
    return result;
  }

  async insertMany(docs: {}[]) {
    await this.shopModel.insertMany(docs);
  }
}
