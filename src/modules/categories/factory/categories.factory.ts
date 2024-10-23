import { Injectable } from "@nestjs/common";
import { CategoryLevelEnum } from "src/common/enums/category.enum";
import { CreateCategoryDto } from "../dto/create-category.dto";
import { IUpdateCategory } from "../dto/update-category.dto";
import { DefaultCategoriesService } from "./default-categories.service";
import { Level1CategoriesService } from "./level1-categories.service";
import { Level2CategoriesService } from "./level2-categories.service";
import { Level3CategoriesService } from "./level3-categories.service";

@Injectable()
export class CategoriesFactory {
    constructor(
        private readonly level1CategoriesService: Level1CategoriesService,
        private readonly level2CategoriesService: Level2CategoriesService,
        private readonly level3CategoriesService: Level3CategoriesService,
        private readonly defaultCategoriesService: DefaultCategoriesService,
    ) { }

    async createOne(payload: CreateCategoryDto) {
        const { level } = payload; //undefined
        switch (level) {
            case CategoryLevelEnum.LV1:
                return this.level1CategoriesService.createOne(payload);
            case CategoryLevelEnum.LV2:
                return this.level2CategoriesService.createOne(payload);
            case CategoryLevelEnum.LV3:
                return this.level3CategoriesService.createOne(payload);
            default:
                return this.defaultCategoriesService.createOne(payload);
        }
    }

    async updateOne(payload: IUpdateCategory) {
        const { level, ...newPayload } = payload;
        switch (level) {
            case CategoryLevelEnum.LV1:
                return this.level1CategoriesService.updateOne(newPayload);
            case CategoryLevelEnum.LV2:
                return this.level2CategoriesService.updateOne(newPayload);
            case CategoryLevelEnum.LV3:
                return this.level3CategoriesService.updateOne(newPayload);
            default:
                return this.defaultCategoriesService.updateOne(newPayload);
        }
    }
}