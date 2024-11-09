import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { GroupUserEnum, IsValidEnum } from 'src/common/enums/index.enum';
import { IKey } from 'src/common/interfaces/index.interface';
import { IdParamTransform } from 'src/middleware/pipe/id-param.transform';
import { DiscountsService } from './discounts.service';
import { DiscountQuery } from './entities/discount.entity';
import { DiscountQueryTransform } from './transform/discount-query.transform';

@ApiTags('Permission Module For Admin Side')
@Controller('admin/discounts')
export class DiscountsControllerAdmin {
  constructor(private readonly discountsService: DiscountsService) { }
  //QUERY ALL//
  @ApiMessage('find all valid discounts')
  @Get('/valid')
  findAllValid(
    @Query(DiscountQueryTransform) query: DiscountQuery
  ) {
    return this.discountsService.findDiscountsIsValid(query, IsValidEnum.VALID, GroupUserEnum.ADMIN);
  }
  @ApiMessage('find all expired discounts')
  @Get('/expired')
  findAllExpired(
    @Query(DiscountQueryTransform) query: DiscountQuery
  ) {
    return this.discountsService.findDiscountsIsValid(query, IsValidEnum.EXPIRED, GroupUserEnum.ADMIN);
  }
  //QUERY ONE//
  @ApiMessage('find a discounts')
  @Get('/:id')
  findOne(@Param('id', IdParamTransform) id: IKey) {
    return this.discountsService.findDiscount(id, GroupUserEnum.ADMIN);
  }
}
