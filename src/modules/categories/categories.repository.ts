import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category, ICategory } from './schemas/category.schema';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: SoftDeleteModel<ICategory>
  ) { }

  async create(createCategoryDto: CreateCategoryDto) {
    const result = await this.categoryModel.create(createCategoryDto);
    return result;
  }

  async isExistNameOrDisplayName(name: string, displayName: string): Promise<boolean> {
    let isExist: Partial<ICategory> = null;
    isExist = await this.categoryModel.exists({ name });
    if (!!isExist) { return true; }
    isExist = await this.categoryModel.exists({ displayName });
    if (!!isExist) { return true; }
    return false; //convert to boolean
  }
}
