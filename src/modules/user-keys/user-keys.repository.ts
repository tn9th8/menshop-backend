import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IKey } from 'src/common/interfaces/index.interface';
import { Metadata } from 'src/common/interfaces/response.interface';
import { UpdateUserKeyDto } from './dto/update-user-keys.dto';
import { UserKeyDoc, UserKey, UserKeyPartial } from './schemas/user-keys.schema';
import { toDbSelect } from 'src/common/utils/mongo.util';

@Injectable()
export class UserKeysRepository {
  constructor(
    @InjectModel(UserKey.name)
    private readonly userKeyModel: SoftDeleteModel<UserKeyDoc>
  ) { }

  //CREATE//
  async createOne({ userId, verifyToken }) {
    const payload = { user: userId, verifyToken }
    const created = await this.userKeyModel.create(payload);
    return (created as any)._doc;
  }

  //UPDATE//
  async updateByIdGetMeta(
    userId: IKey,
    payload: any
  ): Promise<Metadata> {
    const updated = await this.userKeyModel.findOneAndUpdate({ user: userId }, payload, { new: true });
    return updated ? { updatedCount: 1 } : { updatedCount: 0 };
  }

  // async updateVerifyTokenById(
  //   userId: IKey,
  //   payload: any,
  //   isNew: boolean = true
  // ): Promise<Metadata> {
  //   const dbOptions = { new: isNew };
  //   const dbQuery = { user: userId };
  //   const updated = await this.userKeyModel.findOneAndUpdate(dbQuery, payload, dbOptions);
  //   return updated ? { updatedCount: 1 } : { updatedCount: 0 };
  // }

  //QUERY//
  async findLeanByQuery(
    userId: IKey,
    select: string[]
  ): Promise<UserKeyDoc | null> {
    return await this.userKeyModel.findOne({ user: userId })
      .select(toDbSelect(select));
  }

  findAll() {
    return `This action returns all userKey`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userKey`;
  }

  update(id: number, updateUserKeyDto: UpdateUserKeyDto) {
    return `This action updates a #${id} userKey`;
  }

  remove(id: number) {
    return `This action removes a #${id} userKey`;
  }
  //FOR INIT DATA SAMPLE
  async count() {
    const result = await this.userKeyModel.count();
    return result;
  }
  async insertMany(docs: {}[]) {
    await this.userKeyModel.insertMany(docs);
  }
}
