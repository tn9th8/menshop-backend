import { Body, Controller, Get, Param, Patch, Post, Query, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { IsPublishedEnum } from 'src/common/enums/index.enum';
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

  @ApiMessage('publish a category')
  @Patch('/published/:id([a-f0-9]{24})')
  @UsePipes(IdParamTransform)
  publishOne(@Param('id') id: IKey) {
    return this.categoriesService.updateIsPublished(id, IsPublishedEnum.PUBLISHED);
  }

  @ApiMessage('draft (unpublished) a category')
  @Patch('/draft/:id([a-f0-9]{24})')
  @UsePipes(IdParamTransform)
  unpublishOne(@Param('id') id: IKey) {
    return this.categoriesService.updateIsPublished(id, IsPublishedEnum.DRAFT);
  }

  //QUERY//
  @ApiMessage('find all draft categories')
  @Get('/draft')
  @UsePipes(QueryCategoryTransform)
  findAllDraft(@Query() query: QueryCategoryDto) {
    return this.categoriesService.findAllByQuery(query, IsPublishedEnum.DRAFT);
  }

  @ApiMessage('find all published categories')
  @Get('/published')
  @UsePipes(QueryCategoryTransform)
  findAllPublished(@Query() query: QueryCategoryDto) {
    return this.categoriesService.findAllByQuery(query, IsPublishedEnum.PUBLISHED);
  }

  @ApiMessage('find one categories')
  @Get(':id([a-f0-9]{24})')
  @UsePipes(IdParamTransform)
  findOne(@Param('id') id: IKey) {
    return this.categoriesService.findOneById(id);
  }

}
