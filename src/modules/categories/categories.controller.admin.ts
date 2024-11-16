import { Body, Controller, Get, Param, Patch, Post, Query, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { GroupUserEnum, IsActiveEnum, IsPublishedEnum } from 'src/common/enums/index.enum';
import { IKey } from 'src/common/interfaces/index.interface';
import { IdParamTransform } from 'src/middleware/pipe/id-param.transform';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryTransform } from './transform/query-category.transform';

@ApiTags('Categories Module For Admin Side')
@Controller('admin/categories')
export class CategoriesControllerAdmin {
  constructor(private readonly categoriesService: CategoriesService) { }
  //CREATE//
  @ApiMessage('create a category')
  @Post()
  createOne(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createOne(createCategoryDto);
  }
  //UPDATE//
  @ApiMessage('update a category')
  @Patch()
  updateOne(@Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.updateOne(updateCategoryDto);
  }

  @ApiMessage('active a category')
  @Patch('/active/:id')
  @UsePipes(IdParamTransform)
  activeOne(@Param('id') id: IKey) {
    return this.categoriesService.updateIsPublished(id, IsActiveEnum.ACTIVE);
  }

  @ApiMessage('disable a category')
  @Patch('/disable/:id')
  @UsePipes(IdParamTransform)
  disableOne(@Param('id') id: IKey) {
    return this.categoriesService.updateIsPublished(id, IsActiveEnum.DISABLE);
  }
  //QUERY//
  @ApiMessage('find all disable categories')
  @Get('/disable')
  @UsePipes(QueryCategoryTransform)
  findAllActive(@Query() query: QueryCategoryDto) {
    return this.categoriesService.findAllByQuery(query, IsActiveEnum.DISABLE);
  }

  @ApiMessage('find all active categories')
  @Get('/active')
  @UsePipes(QueryCategoryTransform)
  findAllDisable(@Query() query: QueryCategoryDto) {
    return this.categoriesService.findAllByQuery(query, IsActiveEnum.ACTIVE);
  }

  @ApiMessage('find one categories')
  @Get(':id')
  @UsePipes(IdParamTransform)
  findOne(@Param('id') id: IKey) {
    return this.categoriesService.findOneById(id, GroupUserEnum.ADMIN);
  }

}
