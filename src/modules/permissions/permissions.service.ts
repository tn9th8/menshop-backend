import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IsSelectEnum, SortEnum } from 'src/common/enums/index.enum';
import { IKey } from 'src/common/interfaces/index.interface';
import { Result } from 'src/common/interfaces/response.interface';
import { createErrorMessage, isExistMessage, notFoundMessage } from 'src/common/utils/exception.util';
import { buildQueryExcludeId, computeItemsAndPages, buildQueryLike } from 'src/common/utils/mongo.util';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/permissions.dto';
import { PermissionsRepository } from './permissions.repository';
import { Permission, PermissionDocument, PermissionQuery } from './schemas/permission.schema';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,
    private readonly permissionsRepo: PermissionsRepository,
  ) { }
  //CREATE//
  async createPermission(body: CreatePermissionDto) {
    const { name, slug, version, group, module, apiMethod, apiPath } = body;
    //api not exist //note: not exist name, slug
    if (await this.permissionsRepo.existPermissionByQuery({ apiPath, apiMethod }))
      throw new ConflictException(isExistMessage('apiPath, apiMethod'));
    const payload: Permission = { name, slug, version, group, module, apiMethod, apiPath };
    const createdPermission = await this.permissionsRepo.createPermission(payload)
    if (!createdPermission)
      throw new BadRequestException(createErrorMessage('permission'));
    return createdPermission;
  }
  //UPDATE//
  async updatePermission(body: UpdatePermissionDto) {
    const { id: permissionId, name, slug, version, group, module, apiMethod, apiPath } = body;
    //api not exist
    if (await this.permissionsRepo.existPermissionByQuery(buildQueryExcludeId({ apiPath, apiMethod }, permissionId)))
      throw new ConflictException(isExistMessage('apiPath, apiMethod'));
    //updated permission
    const payload: Permission = { name, slug, version, group, module, apiMethod, apiPath };
    const updatedPermission = await this.permissionsRepo.updatePermissionByQuery(payload, { _id: permissionId });
    if (!updatedPermission)
      throw new NotFoundException(notFoundMessage('permission'));
    return updatedPermission;
  }
  //DELETE//
  async deletePermission(permissionId: IKey) {
    const metadata = await this.permissionsRepo.deletePermissionByQuery({ _id: permissionId });
    return metadata;
  }
  //QUERY ALL//
  async findPermissions(
    query: PermissionQuery
  ): Promise<Result<Permission>> {
    const { page = 1, limit = 24, sort = SortEnum.LATEST, name, apiPath, module } = query;
    query = { ...query, ...buildQueryLike(['name', 'apiPath', 'module'], [name, apiPath, module]) }
    const unselect = ['createdAt', 'updatedAt', 'isDeleted', 'deletedAt', '__v'];
    const { data, metadata } = await this.permissionsRepo.findPermissionsByQuery(
      page, limit, sort, query, unselect, IsSelectEnum.UNSELECT);
    const { items, pages } = computeItemsAndPages(metadata, limit);
    return { data, metadata: { page, limit, items, pages } };
  }
  //QUERY ONE//
  async findPermission(
    permissionId: IKey
  ): Promise<Permission> {
    const query = { _id: permissionId }
    const unselect = ['createdAt', 'updatedAt', 'deletedAt', '__v'];
    const found = await this.permissionsRepo.findPermissionByQuery(query, unselect, IsSelectEnum.UNSELECT);
    if (!found)
      throw new NotFoundException(notFoundMessage('permission'));
    return found;
  }
}
