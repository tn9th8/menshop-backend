import { Body, Controller, Get, Param, Patch, Post, Query, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { IdParamTransform } from 'src/core/pipe/id-param.transform';
import { IsActiveEnum } from 'src/common/enums/index.enum';
import { IKey } from 'src/common/interfaces/index.interface';
import { QueryUserTransform } from './transform/query-user.transform';
import { QueryUserDto } from './dto/query-user.dto';

@ApiTags('Users Module for Admins')
@Controller('admin/users')
export class UsersControllerAdmin {
  constructor(private readonly usersService: UsersService) { }

  @ApiMessage('create an user')
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const result = await this.usersService.createAdmin(createUserDto);
    return result;
  }

  @Patch()
  @ApiMessage('update an user')
  update(@Body() updateUserDto: UpdateUserDto) {
    const result = this.usersService.updateOne(updateUserDto);
    return result;
  }

  @ApiMessage('active an user')
  @Patch('/active/:id([a-f0-9]{24})')
  @UsePipes(IdParamTransform)
  activeOne(@Param('id') id: IKey) {
    return this.usersService.updateIsActive(id, IsActiveEnum.ACTIVE);
  }

  @ApiMessage('disable an user')
  @Patch('/disable/:id([a-f0-9]{24})')
  @UsePipes(IdParamTransform)
  disableOne(@Param('id') id: IKey) {
    return this.usersService.updateIsActive(id, IsActiveEnum.DISABLE);
  }

  //QUERY//
  @ApiMessage('find all active')
  @Get('/active')
  @UsePipes(QueryUserTransform)
  findAllActive(@Query() query: QueryUserDto) {
    return this.usersService.findAllByQuery(query, IsActiveEnum.ACTIVE);
  }

  @ApiMessage('find all disable')
  @Get('/disable')
  @UsePipes(QueryUserTransform)
  findAllDisable(@Query() query: QueryUserDto) {
    return this.usersService.findAllByQuery(query, IsActiveEnum.DISABLE);
  }

  @ApiMessage('find one user')
  @Get(':id([a-f0-9]{24})')
  @UsePipes(IdParamTransform)
  findOne(@Param('id') id: IKey) {
    return this.usersService.findOneById(id);
  }
}