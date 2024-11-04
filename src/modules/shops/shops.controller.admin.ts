import { Controller, Get, Param, Patch, Query, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { GroupUserEnum, IsActiveEnum } from 'src/common/enums/index.enum';
import { IKey } from 'src/common/interfaces/index.interface';
import { IdParamTransform } from 'src/middleware/pipe/id-param.transform';
import { QueryShopDto } from './dto/query-shop.dto';
import { ShopsService } from './shops.service';
import { QueryShopTransform } from './transform/query-shop.transform';

@ApiTags('Shops Module for Admin Side')
@Controller('/admin/shops')
export class ShopsControllerAdmin {
  constructor(private readonly shopsService: ShopsService) { }
  //UPDATE//
  @ApiMessage('active a shop')
  @Patch('/active/:id')
  @UsePipes(IdParamTransform)
  activeOne(@Param('id') id: IKey) {
    return this.shopsService.updateIsActive(id, IsActiveEnum.ACTIVE);
  }

  @ApiMessage('disable a shop')
  @Patch('/disable/:id')
  @UsePipes(IdParamTransform)
  disableOne(@Param('id') id: IKey) {
    return this.shopsService.updateIsActive(id, IsActiveEnum.DISABLE);
  }
  //QUERY//
  @ApiMessage('find all active shops')
  @Get('/active')
  @UsePipes(QueryShopTransform)
  findAllActive(@Query() query: QueryShopDto) {
    return this.shopsService.findAllByQuery(query, IsActiveEnum.ACTIVE);
  }

  @ApiMessage('find all disable shops')
  @Get('/disable')
  @UsePipes(QueryShopTransform)
  findAllDisable(@Query() query: QueryShopDto) {
    return this.shopsService.findAllByQuery(query, IsActiveEnum.DISABLE);
  }

  @ApiMessage('find one shop')
  @Get(':id')
  @UsePipes(IdParamTransform)
  findOne(@Param('id') id: IKey) {
    return this.shopsService.findOneById(id, GroupUserEnum.ADMIN);
  }
}
