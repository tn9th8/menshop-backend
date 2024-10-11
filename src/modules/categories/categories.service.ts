import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoryTypeEnum } from 'src/common/enums/category-type.enum';
import { isObjetId } from 'src/common/utils/mongo.util';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) { }

  async create(createCategoryDto: CreateCategoryDto) {
    const { name, displayName, type, parent } = createCategoryDto;
    let isExist: boolean = null;
    //check unique name
    isExist = await this.categoriesRepository.isExistNameOrDisplayName(name, displayName);
    if (isExist) { throw new BadRequestException(`name hoặc displayName đã tồn tại: ${name}, ${displayName}`); }
    //check if child, should ref parent
    if (type != CategoryTypeEnum.PARENT && !isObjetId(parent as any)) { throw new BadRequestException(`parent nên là một object id: ${parent}`); }
    const result = this.categoriesRepository.create(createCategoryDto);
    return result;
  }

  findAll() {
    return `This action returns all categories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
