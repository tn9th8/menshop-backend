import { Body, Controller, Get, Param, Patch, Post, Query, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { IsActiveEnum } from 'src/common/enums/index.enum';
import { IKey } from 'src/common/interfaces/index.interface';
import { IdParamTransform } from 'src/core/pipe/id-param.transform';
import { CreateShopDto } from './dto/create-shop.dto';
import { QueryShopDto } from './dto/query-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { ShopsService } from './shops.service';
import { QueryShopTransform } from './transform/query-shop.transform';

@ApiTags('Shops Module for Admins')
@Controller('/admin/shops')
export class ShopsControllerAdmin {
  constructor(private readonly shopsService: ShopsService) { }

  //CREATE//
  @ApiMessage('create a shop')
  @Post()
  create(
    @Body() createShopDto: CreateShopDto,
    @User() user: AuthUserDto
  ) {
    return this.shopsService.create(createShopDto, user);
  }

  //UPDATE//
  @ApiMessage('update a shop')
  @Patch()
  update(
    @Body() updateShopDto: UpdateShopDto,
    @User() user: AuthUserDto
  ) {
    return this.shopsService.update(updateShopDto, user);
  }

  @ApiMessage('active a shop')
  @Patch('/active/:id([a-f0-9]{24})')
  @UsePipes(IdParamTransform)
  activeOne(@Param('id') id: IKey) {
    return this.shopsService.updateIsActive(id, IsActiveEnum.ACTIVE);
  }

  @ApiMessage('disable a shop')
  @Patch('/disable/:id([a-f0-9]{24})')
  @UsePipes(IdParamTransform)
  disableOne(@Param('id') id: IKey) {
    return this.shopsService.updateIsActive(id, IsActiveEnum.DISABLE);
  }

  //QUERY//
  @ApiMessage('find all active shops')
  @Get('/active')
  @UsePipes(QueryShopTransform)
  findAllPublished(@Query() query: QueryShopDto) {
    return this.shopsService.findAllByQuery(query, IsActiveEnum.ACTIVE);
  }

  @ApiMessage('find all disable shops')
  @Get('/disable')
  @UsePipes(QueryShopTransform)
  findAllDraft(@Query() query: QueryShopDto) {
    return this.shopsService.findAllByQuery(query, IsActiveEnum.DISABLE);
  }
}
