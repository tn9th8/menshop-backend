import { Body, Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { ForUserEnum, IsValidEnum } from 'src/common/enums/index.enum';
import { DiscountsService } from './discounts.service';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { DiscountQuery } from './schemas/discount.schema';
import { DiscountQueryTransform } from './transform/discount-query.transform';
import { IKey } from 'src/common/interfaces/index.interface';
import { IdParamTransform } from 'src/core/pipe/id-param.transform';

@Controller('admin/discounts')
export class DiscountsControllerAdmin {
  constructor(private readonly discountsService: DiscountsService) { }
  //QUERY ALL//
  @ApiMessage('find all valid discounts')
  @Get('/valid')
  findAllValid(
    @Query(DiscountQueryTransform) query: DiscountQuery
  ) {
    return this.discountsService.findDiscountsIsValid(query, IsValidEnum.VALID, ForUserEnum.ADMIN);
  }
  @ApiMessage('find all expired discounts')
  @Get('/expired')
  findAllExpired(
    @Query(DiscountQueryTransform) query: DiscountQuery
  ) {
    return this.discountsService.findDiscountsIsValid(query, IsValidEnum.EXPIRED, ForUserEnum.ADMIN);
  }
  //QUERY ONE//
  @ApiMessage('find a discounts')
  @Get('/:id')
  findOne(@Param('id', IdParamTransform) id: IKey) {
    return this.discountsService.findDiscountById(id, ForUserEnum.ADMIN);
  }
}
