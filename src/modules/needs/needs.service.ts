import { Injectable } from '@nestjs/common';
import { CreateNeedDto } from './dto/create-need.dto';
import { UpdateNeedDto } from './dto/update-need.dto';

@Injectable()
export class NeedsService {
  create(createNeedDto: CreateNeedDto) {
    return 'This action adds a new need';
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
