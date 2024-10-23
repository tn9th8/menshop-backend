import { Injectable } from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IShop, Shop } from './schemas/shop.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IKey } from 'src/common/interfaces/index.interface';
import { QueryOptions } from 'mongoose';

@Injectable()
export class ShopsRepository {
  constructor(
    @InjectModel(Shop.name)
    private readonly shopModel: SoftDeleteModel<IShop>
  ) { }

  //CREATE//
  async create(payload: any): Promise<IShop> {
    const { userId, ...dbPayload } = payload;
    const created = await this.shopModel.create({ ...dbPayload, user: userId });
    return created;
  }

  //UPDATE//
  async updateOneByQuery(
    payload: any,
    query: any,
    isNew: boolean = true
  ) {
    const dbQuery = { _id: query.shopId, user: query.userId };
    const dbOptions: QueryOptions = { new: isNew };
    const updated = await this.shopModel.findOneAndUpdate(dbQuery, payload, dbOptions);
    return updated;
  }

  //EXIST// the exists method return {_id} | null
  async isExistById(needId: IKey) {
    const isExist = await this.shopModel.exists({ _id: needId });
    return isExist ? true : false;
  }

  async isExistByQuery(query: any) {
    const isExist = await this.shopModel.exists(query);
    return isExist ? true : false;
  }

  async isExistByQueryAndExcludeId(query: any, id: IKey) {
    const isExist = await this.shopModel.exists({
      ...query,
      _id: { $ne: id } //exclude the id document
    });
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
