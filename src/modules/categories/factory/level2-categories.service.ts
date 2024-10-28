import { Injectable } from "@nestjs/common";
import { CategoriesRepository } from "../categories.repository";
import { CreateCategoryDto } from "../dto/create-category.dto";
import { UpdateCategoryDto } from "../dto/update-category.dto";
import { UtilCategoriesService } from "./util-categories.service";

@Injectable()
export class Level2CategoriesService {
    /*
    * Level 2:
    * - Can have children. If not, []
    * - Can have parent
    */

    constructor(
        private readonly categoriesRepository: CategoriesRepository,
        private readonly utilCategoriesService: UtilCategoriesService
    ) { }

    async createOne(payload: CreateCategoryDto) {
        const { attributes, specifications, parent, ...cleanPayload } = payload;
        const createdCategory = await this.categoriesRepository.createOne(cleanPayload);
        //push createdCategory to parent sync-ly
        this.utilCategoriesService.pushToParent(createdCategory._id, parent);
        return createdCategory;
    }

    async updateOne(payload: UpdateCategoryDto) {
        const { attributes, specifications, parent, id: categoryId, ...cleanPayload } = payload;
        const updatedCategory = await this.categoriesRepository.updateOneById(categoryId, cleanPayload);
        //push createdCategory to parent sync-ly
        this.utilCategoriesService.pushToParent(updatedCategory._id, parent);
        return updatedCategory;
    }

}