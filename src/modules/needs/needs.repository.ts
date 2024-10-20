import { Injectable } from '@nestjs/common';
import { CreateNeedDto } from './dto/create-need.dto';
import { UpdateNeedDto } from './dto/update-need.dto';
import { INeed, Need } from './schemas/need.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IKey } from 'src/common/interfaces/index.interface';
import { FilterQuery } from 'mongoose';
import { ICategory } from '../categories/schemas/category.schema';

@Injectable()
export class NeedsRepository {
  constructor(
    @InjectModel(Need.name)
    private readonly needModel: SoftDeleteModel<INeed>
  ) { }

  create(createNeedDto: CreateNeedDto) {
    return 'This action adds a new need';
  }

  //exist
  async isExistId(id: IKey) {
    const isExist = await this.needModel.exists({ _id: id });
    if (!!isExist) { return true; }
    return false;
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
