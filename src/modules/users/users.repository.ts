import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser, User } from './schemas/user.scheme';
import { toDbSelect } from 'src/common/utils/mongo.util';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: SoftDeleteModel<IUser>
  ) { }

  async count() {
    const result = await this.userModel.count();
    return result;
  }

  //QUERY//
  async findLeanByQuery(
    query: any, //{email}
    select: string[]
  ) {
    const found = await this.userModel.findOne(query)
      .select(toDbSelect(select));
    return found;
  }

  async insertMany(docs: {}[]) {
    await this.userModel.insertMany(docs);
  }

}
