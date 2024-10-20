import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { IKey } from 'src/common/interfaces/index.interface';
import { ParseObjectIdPipe } from 'src/core/pipe/parse-object-id.pipe';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryPipe } from './transformation/query-category.pipe';
import { UpdatedCategoryPipe } from './transformation/updated-category.pipe';

@ApiTags('Categories Module For Admin Side')
@Controller('admin/categories')
export class AdminsCategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  //CREATE//
  @ApiMessage('create a category for admin side')
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto);
  }

  //QUERY//
  @ApiMessage('get all categories for admin side')
  @Get()
  @UsePipes(QueryCategoryPipe)
  async findAll(@Query() queryString: any) {
    return await this.categoriesService.findAll(queryString);
  }

  @Get('/:id([a-f0-9]{24})') //
  @UsePipes(ParseObjectIdPipe)
  findOne(@Param('id') id: IKey) {
    return this.categoriesService.findOne(id);
  }

  //UPDATE//
  @ApiMessage('update a category for admin side')
  @Patch()
  update(@Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(updateCategoryDto);
  }

  @ApiMessage('publish a product for admin side')
  @Patch('/published/:id')
  @UsePipes(ParseObjectIdPipe)
  publishOne(
    @Param('id') id: IKey
  ) {
    return this.categoriesService.updateIsPublished(id, true);
  }

  @ApiMessage('publish a product for admin side')
  @Patch('/unpublished/:id')
  @UsePipes(ParseObjectIdPipe)
  unpublishOne(
    @Param('id') id: IKey
  ) {
    return this.categoriesService.updateIsPublished(id, false);
  }
}
