import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IsSelectEnum, SortEnum } from 'src/common/enums/index.enum';
import { IKey } from 'src/common/interfaces/index.interface';
import { Metadata, Result } from 'src/common/interfaces/response.interface';
import { toDbSelectOrUnselect, toDbSkip, toDbSort } from 'src/common/utils/mongo.util';
import { Permission, PermissionDoc, PermissionPartial } from './schemas/permission.schema';

@Injectable()
export class PermissionsRepository {
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: SoftDeleteModel<PermissionDoc>,
  ) { }
  //CREATE//
  async createPermission(payload: Permission): Promise<PermissionDoc | null> {
    try {
      const { _doc: created } = await this.permissionModel.create(payload);
      return created;
    } catch (error) {
      console.log('>>> Exception: PermissionsRepository: createPermission: ' + error);
      return null;
    }
  }
  //UPDATE//
  async updatePermissionByQuery(payload: PermissionPartial, query: any): Promise<PermissionDoc | null> {
    const updated = await this.permissionModel.findOneAndUpdate(query, payload, { new: true }).lean();
    return updated || null;
  }
  //DELETE//
  async deletePermissionByQuery(query: any): Promise<Metadata> {
    const metadata = await this.permissionModel.softDelete(query);
    return { deletedCount: metadata.deleted };
  }
  //EXIST//
  async existPermissionByQuery(query: any): Promise<{ _id: IKey } | null> {
    const isExist = await this.permissionModel.exists(query).lean(); //note: can't get deleted
    return isExist || null;
  }
  //QUERY ALL//
  async findPermissionsByQuery(
    page: number, limit: number, sort: SortEnum, query: any, select: string[], isSelect: IsSelectEnum
  ): Promise<Result<Permission>> {
    const [queriedCount, data] = await Promise.all([
      this.permissionModel.countDocuments(query),
      this.permissionModel.find(query)
        .select(toDbSelectOrUnselect(select, isSelect)) //note: can't get deleted
        .sort(toDbSort(sort))
        .skip(toDbSkip(page, limit))
        .limit(limit)
        .lean()
    ]);
    return { data, metadata: { queriedCount } };
  }
  //QUERY ONE//
  async findPermissionByQuery(
    query: any, select: string[], isSelect: IsSelectEnum
  ): Promise<Permission | null> {
    const found = await this.permissionModel.findOne(query) //note: can get deleted
      .select(toDbSelectOrUnselect(select, isSelect))
      .lean();
    return found || null;
  }
}
