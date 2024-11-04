import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { IKey } from 'src/common/interfaces/index.interface';
import { IdParamTransform } from 'src/middleware/pipe/id-param.transform';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/permissions.dto';
import { PermissionsService } from './permissions.service';
import { PermissionQuery } from './schemas/permission.schema';
import { IdBodyTransform } from 'src/middleware/pipe/id-body.transform';

@ApiTags('Permission Module For Admin Side')
@Controller('/admin/permissions')
export class PermissionsControllerAdmin {
  constructor(private readonly permissionsService: PermissionsService) { }
  //CREATE//
  @ApiMessage('create a permission')
  @Post('/')
  createOne(
    @Body() body: CreatePermissionDto
  ) {
    return this.permissionsService.createPermission(body);
  }
  //UPDATE//
  @ApiMessage('update a permission')
  @Patch('/')
  updateOne(
    @Body(IdBodyTransform) body: UpdatePermissionDto
  ) {
    return this.permissionsService.updatePermission(body);
  }
  //DELETE//
  @ApiMessage('delete a permission')
  @Delete('/:id')
  deleteOne(
    @Param('id', IdParamTransform) id: IKey
  ) {
    return this.permissionsService.deletePermission(id);
  }
  //QUERY ALL//
  @ApiMessage('find all permissions')
  @Get('/')
  findAll(
    @Query() query: PermissionQuery
  ) {
    return this.permissionsService.findPermissions(query);
  }
  //QUERY ONE//
  @ApiMessage('find a permission')
  @Get('/:id')
  findOne(@Param('id', IdParamTransform) id: IKey) {
    return this.permissionsService.findPermission(id);
  }
}