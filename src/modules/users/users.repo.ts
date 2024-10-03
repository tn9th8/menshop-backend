import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser, User } from './schemas/user.scheme';

@Injectable()
export class UsersRepo {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: SoftDeleteModel<IUser>
  ) { }

  async count() {
    const result = await this.userModel.count();
    return result;
  }

  async insertMany(docs: {}[]) {
    await this.userModel.insertMany(docs);
  }

}
