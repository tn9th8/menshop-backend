import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesControllerAdmin } from './categories.controller.admin';
import { CategoriesControllerClient } from './categories.controller.client';
import { CategoriesRepository } from './categories.repository';
import { CategoriesService } from './categories.service';
import { CategoriesFactory } from './factory/categories.factory';
import { DefaultCategoriesService } from './factory/default-categories.service';
import { Level1CategoriesService } from './factory/level1-categories.service';
import { Level2CategoriesService } from './factory/level2-categories.service';
import { Level3CategoriesService } from './factory/level3-categories.service';
import { UtilCategoriesService } from './factory/util-categories.service';
import { Category, CategorySchema } from './schemas/category.schema';
import { CreateCategoryTransform } from './transform/create-category.transform';
import { UpdatedCategoryTransform } from './transform/update-category.transform';
import { CategoriesControllerSeller } from './categories.controller.seller';

@Module({
  controllers: [CategoriesControllerAdmin, CategoriesControllerSeller, CategoriesControllerClient],
  providers: [
    CategoriesService, CategoriesRepository,
    CategoriesFactory, UtilCategoriesService,
    Level1CategoriesService, Level2CategoriesService, Level3CategoriesService, DefaultCategoriesService,
    CreateCategoryTransform, UpdatedCategoryTransform
  ],
  imports: [MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])],
  exports: [CategoriesService, CategoriesRepository]
})
export class CategoriesModule { }
