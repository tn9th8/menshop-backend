import { Injectable } from "@nestjs/common";
import { CategoriesRepository } from "../categories.repository";
import { CreateCategoryDto } from "../dto/create-category.dto";
import { UpdateCategoryDto } from "../dto/update-category.dto";


@Injectable()
export class Level1CategoriesService {
    /*
     * Level 1:
     * - Can have children. If not, []
     * - No parent
     * - Have to have search
     */

    constructor(private readonly categoriesRepository: CategoriesRepository) { }

    async createOne(payload: CreateCategoryDto) {
        const { parent, ...cleanPayload } = payload;
        const createdCategory = await this.categoriesRepository.createOne(cleanPayload);
        return createdCategory;
    }

    async updateOne(payload: UpdateCategoryDto) {
        const { parent, id: categoryId, ...cleanPayload } = payload;
        const updated = await this.categoriesRepository.updateOneById(categoryId, cleanPayload);
        return updated;
    }
}