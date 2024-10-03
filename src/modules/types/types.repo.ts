import { Injectable } from '@nestjs/common';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IType, Type } from './schemas/type.schema';

@Injectable()
export class TypesRepo {
  constructor(
    @InjectModel(Type.name)
    private readonly typeModel: SoftDeleteModel<IType>
  ) { }

  async create(createTypeDto: CreateTypeDto) {
    //todo: isUnique name
    const result = await this.typeModel.create(createTypeDto);
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
