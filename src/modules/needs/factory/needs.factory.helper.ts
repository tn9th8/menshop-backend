import { Injectable } from "@nestjs/common";
import { NeedsRepository } from "../needs.repository";
import { IKey } from "src/common/interfaces/index.interface";

@Injectable()
export class UtilNeedsService {
    constructor(private readonly needsRepository: NeedsRepository) { }

    //UPDATE//
    async pushToParent(needId: IKey, parentId: IKey) {
        const select = ['children'];
        const foundParent = await this.needsRepository.findLeanById(parentId, select);
        //check: no include => push
        //but new => always no include => no check
        foundParent.children.push(needId) //todo: bug parent null
        const updatedParent = await this.needsRepository.updateLeanById(parentId, foundParent);
        return updatedParent;
    }

}