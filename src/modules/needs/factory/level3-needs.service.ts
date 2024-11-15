import { Injectable } from "@nestjs/common";
import { CreateNeedDto } from "../dto/create-need.dto";
import { UpdateNeedDto } from "../dto/update-need.dto";
import { NeedsRepository } from "../needs.repository";
import { UtilNeedsService } from "./needs.factory.helper";


@Injectable()
export class Level3NeedsService {
    /*
    * Level 3:
    * - No children, default []
    * - Can have parent
    */

    constructor(
        private readonly needsRepository: NeedsRepository,
        private readonly utilNeedsService: UtilNeedsService
    ) { }


    async createOne(payload: CreateNeedDto) {
        const { parent, children, ...cleanPayload } = payload;
        const createdNeed = await this.needsRepository.createOne(cleanPayload);
        //push createdNeed to parent sync-ly
        this.utilNeedsService.pushToParent(createdNeed._id, parent);
        return createdNeed;
    }

    async updateOne(payload: UpdateNeedDto) {
        const { parent, children, id: needId, ...cleanPayload } = payload;
        const updatedNeed = await this.needsRepository.updateOneById(needId, cleanPayload);
        //push createdNeed to parent sync-ly
        this.utilNeedsService.pushToParent(updatedNeed._id, parent);
        return updatedNeed;
    }
}