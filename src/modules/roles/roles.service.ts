import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IsSelectEnum, SortEnum } from 'src/common/enums/index.enum';
import { IKey, IReference } from 'src/common/interfaces/index.interface';
import { Result } from 'src/common/interfaces/response.interface';
import { createErrorMessage, isExistMessage, notFoundMessage } from 'src/common/utils/exception.util';
import { buildQueryExcludeId, buildQueryLike, computeItemsAndPages } from 'src/common/utils/mongo.util';
import { CreateRoleDto, UpdateRoleDto } from './dto/roles.dto';
import { RolesRepository } from './roles.repository';
import { Role, RoleDoc, RoleQuery } from './schemas/role.schema';
import { RoleGroupEnum } from './enum/role.enum';

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepo: RolesRepository) { }
  //CREATE//
  async createRole(body: CreateRoleDto) {
    const { name, description, group, permissions, isActive } = body;
    //api not exist
    if (await this.rolesRepo.existRoleByQuery({ name }))
      throw new ConflictException(isExistMessage('name'));
    const payload: Role = { name, description, group, permissions, isActive };
    const createdRole = await this.rolesRepo.createRole(payload)
    if (!createdRole)
      throw new BadRequestException(createErrorMessage('role'));
    return createdRole;
  }
  //UPDATE//
  async updateRole(body: UpdateRoleDto) {
    const { id: roleId, name, description, group, permissions, isActive } = body;
    //api not exist
    if (await this.rolesRepo.existRoleByQuery(buildQueryExcludeId({ name }, roleId)))
      throw new ConflictException(isExistMessage('name'));
    //updated role
    const payload: Role = { name, description, group, permissions, isActive };
    const updatedRole = await this.rolesRepo.updateRoleByQuery(payload, { _id: roleId });
    if (!updatedRole)
      throw new NotFoundException(notFoundMessage('role'));
    return updatedRole;
  }
  //DELETE//
  async deleteRole(roleId: IKey) {
    //prevent delete a admin role
    if (await this.rolesRepo.existRoleByQuery({ _id: roleId, group: 'admin' }))
      throw new ForbiddenException('Nghiêm cấm xóa role trong nhóm admin !');
    //delete one
    const metadata = await this.rolesRepo.deleteRoleByQuery(roleId);
    return metadata;
  }
  //QUERY ALL//
  async findRoles(
    query: RoleQuery
  ): Promise<Result<Role>> {
    const { page = 1, limit = 24, sort = SortEnum.LATEST, name } = query;
    query = { ...query, ...buildQueryLike(['name'], [name]) };
    const unselect = ['createdAt', 'updatedAt', 'isDeleted', 'deletedAt', '__v'];
    const { data, metadata } = await this.rolesRepo.findRolesByQuery(
      page, limit, sort, query, unselect, IsSelectEnum.UNSELECT);
    const { items, pages } = computeItemsAndPages(metadata, limit);
    return { data, metadata: { page, limit, items, pages } };
  }
  //QUERY ONE//
  async findRole(roleId: IKey): Promise<RoleDoc> {
    const unselect = ['createdAt', 'updatedAt', 'isDeleted', 'deletedAt', '__v'];
    const references: IReference[] = [{ attribute: 'permissions', select: ['_id', 'apiPath', 'apiMethod'] }];
    const found = await this.rolesRepo.findRoleByQueryRefer({ _id: roleId }, unselect, IsSelectEnum.UNSELECT, references);
    if (!found) throw new NotFoundException(notFoundMessage('role'));
    return found;
  }

  async findRoleForAuth(roleId: IKey): Promise<RoleDoc> {
    const select = ['_id', 'name', 'group', 'permissions'];
    const references: IReference[] = [{ attribute: 'permissions', select: ['_id', 'apiPath', 'apiMethod'] }];
    const found = await this.rolesRepo.findRoleByQueryRefer({ _id: roleId }, select, IsSelectEnum.SELECT, references);
    if (!found) throw new NotFoundException(notFoundMessage('role'));
    return found;
  }
  //OTHER SERVICE
  //users
  async findRolesForUser(roleIds: IKey[]) {
    const select = ['_id', 'name', 'group'];
    let founds = await Promise.all(roleIds.map(roleId => {
      const found = this.rolesRepo.findRoleByQueryRefer(
        { _id: roleId, isActive: true }, select, IsSelectEnum.SELECT);
      return found;
    }));
    founds = founds.filter(Boolean);
    const ids = founds.map(founds => founds._id);
    const isSeller = founds.find(
      found => found.group === RoleGroupEnum.SELLER) ? true : false;
    return { ids, isSeller };
  }

  async findRoleForUser(roleId: IKey[]): Promise<RoleDoc> {
    const select = ['_id', 'name', 'group'];
    const found = this.rolesRepo.findRoleByQueryRefer(
      { _id: roleId, isActive: true }, select, IsSelectEnum.SELECT);
    if (!found) throw new NotFoundException(notFoundMessage('role'));
    return found;
  }
}

