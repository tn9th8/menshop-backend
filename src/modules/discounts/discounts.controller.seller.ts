import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { IAuthUser } from 'src/common/interfaces/auth-user.interface';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { GroupUserEnum, IsValidEnum } from 'src/common/enums/index.enum';
import { IKey } from 'src/common/interfaces/index.interface';
import { IdParamTransform } from 'src/middleware/pipe/id-param.transform';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { DiscountQuery } from './entities/discount.entity';
import { CreateDiscountTransform } from './transform/create-discount.transform';
import { DiscountQueryTransform } from './transform/discount-query.transform';
import { UpdateDiscountTransform } from './transform/update-discount.transform';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Permission Module For Client Side')
@Controller('seller/discounts')
export class DiscountsControllerSeller {
  constructor(private readonly discountsService: DiscountsService) { }
  //CREATE//
  @ApiMessage('create a discount')
  @Post()
  createOne(
    @Body(CreateDiscountTransform) body: CreateDiscountDto,
    @User() user: IAuthUser
  ) {
    return this.discountsService.createDiscountForShop(body, user);
  }
  //UPDATE//
  @ApiMessage('update a discount')
  @Patch()
  updateOne(
    @Body(UpdateDiscountTransform) body: UpdateDiscountDto,
    @User() user: IAuthUser
  ) {
    return this.discountsService.updateDiscountForShop(body, user);
  }
  //QUERY ALL
  @ApiMessage('find all valid discounts')
  @Get('/valid')
  findAllValidForShop(
    @Query(DiscountQueryTransform) query: DiscountQuery,
    @User() user: IAuthUser
  ) {
    return this.discountsService.findDiscountsIsValid(query, IsValidEnum.VALID, GroupUserEnum.SELLER, user);
  }
  @ApiMessage('find all expired discounts')
  @Get('/expired')
  findAllExpired(
    @Query(DiscountQueryTransform) query: DiscountQuery,
    @User() user: IAuthUser
  ) {
    return this.discountsService.findDiscountsIsValid(query, IsValidEnum.EXPIRED, GroupUserEnum.SELLER, user);
  }
  //QUERY ONE//
  @ApiMessage('find a discounts')
  @Get('/:id')
  findOne(
    @Param('id', IdParamTransform) id: IKey,
    @User() user: IAuthUser
  ) {
    return this.discountsService.findDiscount(id, GroupUserEnum.SELLER, user);
  }
}
