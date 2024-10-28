import { Injectable } from "@nestjs/common";
import { CategoriesRepository } from "../categories.repository";
import { IKey } from "src/common/interfaces/index.interface";

@Injectable()
export class UtilCategoriesService {
    constructor(private readonly categoriesRepository: CategoriesRepository) { }

    //UPDATE//
    async pushToParent(needId: IKey, parentId: IKey) {
        const select = ['children'];
        const foundParent = await this.categoriesRepository.findLeanById(parentId, select);
        //check: no include => push
        //but new => always no include => no check
        foundParent.children.push(needId)
        const updatedParent = await this.categoriesRepository.updateLeanById(parentId, foundParent);
        return updatedParent;
    }

}