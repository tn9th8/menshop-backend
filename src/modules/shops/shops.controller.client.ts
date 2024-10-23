import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';
import { User } from 'src/common/decorators/user.decorator';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { IdParamTransform } from 'src/core/pipe/id-param.transform';
import { IKey } from 'src/common/interfaces/index.interface';
import { SkipJwt } from 'src/common/decorators/skip-jwt.decorator';

@ApiTags('Shops Module for Admins')
@Controller('/client/shops')
export class ShopsControllerClient {
  constructor(private readonly shopsService: ShopsService) { }

  //QUERY//
  @ApiMessage('find one needs')
  @Get(':id([a-f0-9]{24})')
  @SkipJwt()
  @UsePipes(IdParamTransform)
  findOne(@Param('id') id: IKey) {
    return this.shopsService.findOneById(id);
  }
}
