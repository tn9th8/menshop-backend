import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { IKey } from 'src/common/interfaces/index.interface';
import { ParseObjectIdPipe } from 'src/core/pipe/parse-object-id.pipe';
import { ParseQueryCategoryPipe } from 'src/core/pipe/parse-query-category.pipe';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

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
  @UsePipes(ParseQueryCategoryPipe)
  async findAll(@Query() queryString: any) {
    return await this.categoriesService.findAll(queryString);
  }

  @Get('/tree')
  findTree() {
    return 'tree';
  }

  @Get('/:id([a-f0-9]{24})') //
  @UsePipes(ParseObjectIdPipe)
  findOne(@Param('id') id: IKey) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
