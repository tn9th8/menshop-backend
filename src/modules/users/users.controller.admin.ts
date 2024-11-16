import { Body, Controller, Get, Param, Patch, Post, Query, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { IsActiveEnum } from 'src/common/enums/index.enum';
import { IKey } from 'src/common/interfaces/index.interface';
import { IdParamTransform } from 'src/middleware/pipe/id-param.transform';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserTransform } from './transform/create-user.transform';
import { QueryUserTransform } from './transform/query-user.transform';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('Users Module for Admin Side')
@Controller('admin/users')
export class UsersControllerAdmin {
  constructor(private readonly usersService: UsersService) { }

  @ApiMessage('create an user')
  @Post()
  async createOne(@Body(CreateUserTransform) body: CreateUserDto) {
    return await this.usersService.createUserFactory(body);
  }

  @ApiMessage('update an user')
  @Patch()
  async updateOne(@Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.updateOne(updateUserDto);
  }

  @ApiMessage('active an user')
  @Patch('/active/:id')
  @UsePipes(IdParamTransform)
  activeOne(@Param('id') id: IKey) {
    return this.usersService.updateIsActive(id, IsActiveEnum.ACTIVE);
  }

  @ApiMessage('disable an user')
  @Patch('/disable/:id')
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
  @Get(':id')
  @UsePipes(IdParamTransform)
  findOne(@Param('id') id: IKey) {
    return this.usersService.findOneById(id);
  }
}