import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { ForUserEnum, IsValidEnum } from 'src/common/enums/index.enum';
import { IKey } from 'src/common/interfaces/index.interface';
import { IdParamTransform } from 'src/core/pipe/id-param.transform';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { DiscountQuery } from './schemas/discount.schema';
import { CreateDiscountTransform } from './transform/create-discount.transform';
import { DiscountQueryTransform } from './transform/discount-query.transform';
import { UpdateDiscountTransform } from './transform/update-discount.transform';

@Controller('seller/discounts')
export class DiscountsControllerSeller {
  constructor(private readonly discountsService: DiscountsService) { }
  //CREATE//
  @ApiMessage('create a discount')
  @Post()
  createOne(
    @Body(CreateDiscountTransform) body: CreateDiscountDto,
    @User() user: AuthUserDto
  ) {
    return this.discountsService.createDiscountForShop(body, user);
  }
  //UPDATE//
  @ApiMessage('update a discount')
  @Patch()
  updateOne(
    @Body(UpdateDiscountTransform) body: UpdateDiscountDto,
    @User() user: AuthUserDto
  ) {
    return this.discountsService.updateDiscountForShop(body, user);
  }
  //QUERY ALL
  @ApiMessage('find all valid discounts')
  @Get('/valid')
  findAllValidForShop(
    @Query(DiscountQueryTransform) query: DiscountQuery,
    @User() user: AuthUserDto
  ) {
    return this.discountsService.findDiscountsIsValid(query, IsValidEnum.VALID, ForUserEnum.SELLER, user);
  }
  @ApiMessage('find all expired discounts')
  @Get('/expired')
  findAllExpired(
    @Query(DiscountQueryTransform) query: DiscountQuery,
    @User() user: AuthUserDto
  ) {
    return this.discountsService.findDiscountsIsValid(query, IsValidEnum.EXPIRED, ForUserEnum.SELLER, user);
  }
  //QUERY ONE//
  @ApiMessage('find a discounts')
  @Get('/:id')
  findOne(
    @Param('id', IdParamTransform) id: IKey,
    @User() user: AuthUserDto
  ) {
    return this.discountsService.findDiscountById(id, ForUserEnum.SELLER, user);
  }
}
