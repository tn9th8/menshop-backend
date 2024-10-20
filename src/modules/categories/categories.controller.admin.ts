import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { Result } from 'src/common/interfaces/response.interface';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ICategory } from './schemas/category.schema';
import { CategoryLevelEnum } from 'src/common/enums/category.enum';
import { CategorySortEnum, ProductSortEnum } from 'src/common/enums/query.enum';
import { ParseQueryCategoryPipe } from 'src/core/pipe/parse-query-category.pipe';
import { FilterQuery } from 'mongoose';

@ApiTags('Categories Module For Admin Side')
@Controller('admin/categories')
export class AdminsCategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  //CREATE//
  @ApiMessage('create a category for admin side')
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Result<ICategory>> {
    return await this.categoriesService.create(createCategoryDto);
  }

  //QUERY//
  @ApiMessage('get all categories for admin side')
  @Get()
  @UsePipes(ParseQueryCategoryPipe)
  async findAll(@Query() queryString: any) {
    return await this.categoriesService.findAll(queryString);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
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
