import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto, UpdateRoleDto } from './dto/roles.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { IKey } from 'src/common/interfaces/index.interface';
import { IdParamTransform } from 'src/middleware/pipe/id-param.transform';
import { IdBodyTransform } from 'src/middleware/pipe/id-body.transform';
import { RoleQuery } from './schemas/role.schema';

@ApiTags('Role Module For Admin Side')
@Controller('/admin/roles')
export class RolesControllerAdmin {
  constructor(private readonly rolesService: RolesService) { }
  //CREATE//
  @ApiMessage('create a new role')
  @Post('/')
  createOne(@Body() body: CreateRoleDto) {
    return this.rolesService.createRole(body);
  }
  //UPDATE//
  @ApiMessage('update a role')
  @Patch('/')
  updateOne(@Body(IdBodyTransform) body: UpdateRoleDto) {
    return this.rolesService.updateRole(body);
  }
  //DELETE//
  @ApiMessage('delete a role')
  @Delete('/:id')
  deleteOne(@Param('id', IdParamTransform) id: IKey) {
    return this.rolesService.deleteRole(id);
  }
  //QUERY ALL//
  @ApiMessage('find all roles')
  @Get('/')
  findAll(
    @Query() query: RoleQuery,
  ) {
    return this.rolesService.findRoles(query);
  }
  //QUERY ONE//
  @Get('/:id')
  @ApiMessage('Fetch a role')
  findOne(@Param('id', IdParamTransform) id: IKey) {
    return this.rolesService.findRole(id);
  }
}
