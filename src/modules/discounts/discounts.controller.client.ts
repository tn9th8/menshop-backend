import { Controller, Get, Param, Query } from '@nestjs/common';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { ForUserEnum, IsValidEnum } from 'src/common/enums/index.enum';
import { IKey } from 'src/common/interfaces/index.interface';
import { IdParamTransform } from 'src/core/pipe/id-param.transform';
import { DiscountsService } from './discounts.service';
import { DiscountQuery } from './schemas/discount.schema';
import { DiscountQueryTransform } from './transform/discount-query.transform';

@Controller('client/discounts')
export class DiscountsControllerClient {
  constructor(private readonly discountsService: DiscountsService) { }
  //QUERY ALL//
  @ApiMessage('find all discounts by shop')
  @Get('/')
  findAllByShop(
    @Query(DiscountQueryTransform) query: DiscountQuery
  ) {
    return this.discountsService.findDiscountsIsValid(query, IsValidEnum.VALID, ForUserEnum.CLIENT);
  }
  @ApiMessage('find products by discount code')
  @Get('/products')
  findProductsByDiscountCode(
    @Query() query: any //page, limit, sort, code
  ) {
    return this.discountsService.findProductsByDiscountCode(query);
  }
  //QUERY ONE//
  @ApiMessage('find a discount')
  @Get('/:id')
  findOne(
    @Param('id', IdParamTransform) id: IKey,
    @User() user: AuthUserDto
  ) {
    return this.discountsService.findDiscountById(id, ForUserEnum.CLIENT);
  }
}
