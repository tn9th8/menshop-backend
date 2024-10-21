import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, QueryOptions } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IKey } from 'src/common/interfaces/index.interface';
import { convertSelectAttrs } from 'src/common/utils/mongo.util';
import { ICategory } from '../categories/schemas/category.schema';
import { CreateNeedDto } from './dto/create-need.dto';
import { UpdateNeedDto } from './dto/update-need.dto';
import { INeed, Need } from './schemas/need.schema';

@Injectable()
export class NeedsRepository {
  constructor(
    @InjectModel(Need.name)
    private readonly needModel: SoftDeleteModel<INeed>
  ) { }
  //CREATE//
  createOne(payload: CreateNeedDto) {
    const created = this.needModel.create(payload);
    return created;
  }

  //UPDATE
  async updateById(
    id: IKey,
    payload: any,
    isReturnNew: boolean = true
  ) {
    const queryDb: FilterQuery<ICategory> = { _id: id };
    const optionsDb: QueryOptions = { new: isReturnNew };
    const { modifiedCount } = await this.needModel.updateOne(queryDb, payload);
    return { modifiedCount };
  }

  //EXIST
  async isExistById(id: IKey) {
    const isExist = await this.needModel.exists({ _id: id });
    if (!!isExist) { return true; }
    return false;
  }

  async isExistByQuery(query: any) {
    const isExist = await this.needModel.exists(query); //null
    return isExist ? true : false;
  }

  //QUERY//
  async findById(
    id: IKey,
    unselect: string[]
  ) {
    return await this.needModel.findById(id)
      .select(convertSelectAttrs(unselect));
  }

  update(id: number, updateNeedDto: UpdateNeedDto) {
    return `This action updates a #${id} need`;
  }

  remove(id: number) {
    return `This action removes a #${id} need`;
  }
}
