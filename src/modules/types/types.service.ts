import { Injectable } from '@nestjs/common';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { TypesRepo } from './types.repo';

@Injectable()
export class TypesService {
  constructor(private readonly typesRepo: TypesRepo) { }

  async create(createTypeDto: CreateTypeDto) {
    const result = await this.typesRepo.create(createTypeDto);
    return result;
  }

  findAll() {
    return `This action returns all types`;
  }

  findOne(id: number) {
    return `This action returns a #${id} type`;
  }

  update(id: number, updateTypeDto: UpdateTypeDto) {
    return `This action updates a #${id} type`;
  }

  remove(id: number) {
    return `This action removes a #${id} type`;
  }
}
