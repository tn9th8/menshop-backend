import { Controller, Get, Param, Query, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { SkipJwt } from 'src/common/decorators/skip-jwt.decorator';
import { CategoriesService } from './categories.service';
import { IdParamTransform } from 'src/middleware/pipe/id-param.transform';
import { IKey } from 'src/common/interfaces/index.interface';
import { GroupUserEnum, IsPublishedEnum } from 'src/common/enums/index.enum';
import { QueryCategoryTransform } from './transform/query-category.transform';
import { QueryCategoryDto } from './dto/query-category.dto';

@ApiTags('Categories Module For Seller Side')
@Controller('/seller/categories')
export class CategoriesControllerSeller {
  constructor(private readonly categoriesService: CategoriesService) { }

  //QUERY//
  @ApiMessage('find all categories')
  @Get('/')
  @SkipJwt()
  @UsePipes(QueryCategoryTransform)
  findAll(@Query() query: QueryCategoryDto) {
    return this.categoriesService.findAllByQuery(query, IsPublishedEnum.PUBLISHED);
  }

  @ApiMessage('find one categories')
  @Get('/:id')
  @SkipJwt()
  @SkipJwt()
  @UsePipes(IdParamTransform)
  findOne(@Param('id') id: IKey) {
    return this.categoriesService.findOneById(id, GroupUserEnum.SELLER);
  }


}
