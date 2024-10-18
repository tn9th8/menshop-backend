import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AdminsCategoriesController } from './categories.controller.admin';
import { ClientsCategoriesController } from './categories.controller.client';
import { CategoriesRepository } from './categories.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schemas/category.schema';
import { AppRepository } from 'src/app.repository';

@Module({
  controllers: [AdminsCategoriesController, ClientsCategoriesController],
  providers: [CategoriesService, CategoriesRepository, AppRepository],
  imports: [MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])],
})
export class CategoriesModule { }
