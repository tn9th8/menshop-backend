import { Injectable } from "@nestjs/common";
import { CreateCategoryDto } from "../dto/create-Category.dto";
import { UpdateCategoryDto } from "../dto/update-Category.dto";
import { Level1CategoriesService } from "./level1-categories.service";

@Injectable()
export class DefaultCategoriesService {
    //when level is null => default level is 1
    constructor(private readonly defaultCategoriesService: Level1CategoriesService) { }

    async createOne(payload: CreateCategoryDto) {
        const result = await this.defaultCategoriesService.createOne(payload);
        return result;
    }

    async updateOne(payload: UpdateCategoryDto) {
        const result = await this.defaultCategoriesService.updateOne(payload);
        return result;
    }
}