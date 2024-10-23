import { Controller, Get, Param, Query, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { SkipJwt } from 'src/common/decorators/skip-jwt.decorator';
import { IsActiveEnum } from 'src/common/enums/index.enum';
import { IKey } from 'src/common/interfaces/index.interface';
import { IdParamTransform } from 'src/core/pipe/id-param.transform';
import { QueryShopDto } from './dto/query-shop.dto';
import { ShopsService } from './shops.service';
import { QueryShopTransform } from './transform/query-shop.transform';

@ApiTags('Shops Module for Admins')
@Controller('/client/shops')
export class ShopsControllerClient {
  constructor(private readonly shopsService: ShopsService) { }

  //QUERY//
  @ApiMessage('find all shops')
  @Get()
  @SkipJwt()
  @UsePipes(QueryShopTransform)
  findAll(@Query() query: QueryShopDto) {
    return this.shopsService.findAllByQuery(query, IsActiveEnum.ACTIVE);
  }

  @ApiMessage('find one shop')
  @Get(':id([a-f0-9]{24})')
  @SkipJwt()
  @UsePipes(IdParamTransform)
  findOne(@Param('id') id: IKey) {
    return this.shopsService.findOneById(id);
  }
}
