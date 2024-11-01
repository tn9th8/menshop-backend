import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IKey, IReference } from 'src/common/interfaces/index.interface';
import { Role, RoleDoc, RolePartial } from './schemas/role.schema';
import { Metadata, Result } from 'src/common/interfaces/response.interface';
import { IsSelectEnum, SortEnum } from 'src/common/enums/index.enum';
import { toDbPopulates, toDbSelect, toDbSelectOrUnselect, toDbSkip, toDbSort } from 'src/common/utils/mongo.util';

@Injectable()
export class RolesRepository {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: SoftDeleteModel<RoleDoc>
  ) { }
  //CREATE//
  async createRole(payload: Role): Promise<RoleDoc | null> {
    try {
      const { _doc: created } = await this.roleModel.create(payload);
      return created;
    } catch (error) {
      console.log('>>> Exception: RolesRepository: createRole: ' + error);
      return null;
    }
  }
  //UPDATE//
  async updateRoleByQuery(payload: RolePartial, query: any): Promise<RoleDoc | null> {
    const updated = await this.roleModel.findOneAndUpdate(query, payload, { new: true }).lean();
    return updated || null;
  }
  //DELETE//
  async deleteRoleByQuery(query: any): Promise<Metadata> {
    const metadata = await this.roleModel.softDelete(query);
    return { deletedCount: metadata.deleted };
  }
  //EXIST//
  async existRoleByQuery(query: any): Promise<{ _id: IKey } | null> {
    const isExist = await this.roleModel.exists(query).lean(); //note: can't get deleted
    return isExist || null;
  }
  //QUERY ALL//
  async findRolesByQuery(
    page: number, limit: number, sort: SortEnum, query: any, select: string[], isSelect: IsSelectEnum
  ): Promise<Result<Role>> {
    const [queriedCount, data] = await Promise.all([
      this.roleModel.countDocuments(query),
      this.roleModel.find(query)
        .select(toDbSelectOrUnselect(select, isSelect)) //note: can't get deleted
        .sort(toDbSort(sort))
        .skip(toDbSkip(page, limit))
        .limit(limit)
        .lean()
    ]);
    return { data, metadata: { queriedCount } };
  }
  //QUERY ONE//
  async findRoleByQueryRefer(
    query: any, select: string[], isSelect: IsSelectEnum, refers: IReference[] = []
  ): Promise<Role | null> {
    const found = await this.roleModel.findOne(query) //note: can get deleted
      .select(toDbSelectOrUnselect(select, isSelect))
      .populate(toDbPopulates(refers))
      .lean();
    return found || null;
  }
  //FOR INIT DATA SAMPLE
  async count() {
    const result = await this.roleModel.count();
    return result;
  }
  async insertMany(docs: {}[]) {
    await this.roleModel.insertMany(docs);
  }
}
