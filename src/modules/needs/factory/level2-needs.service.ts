import { Injectable } from "@nestjs/common";
import { NeedsRepository } from "../needs.repository";
import { CreateNeedDto } from "../dto/create-need.dto";
import { CreateNeedTransform } from "../transform/create-need.transform";
import { IKey } from "src/common/interfaces/index.interface";
import { UtilNeedsService } from "./util-needs.service";

@Injectable()
export class Level2NeedsService {
    /*
    * Level 2:
    * - Can have children. If not, []
    * - Can have parent
    */

    constructor(
        private readonly needsRepository: NeedsRepository,
        private readonly createNeedTransform: CreateNeedTransform,
        private readonly utilNeedsService: UtilNeedsService,
    ) { }

    async createOne(payload: CreateNeedDto) {
        const { parent, ...cleanPayload } = await this.createNeedTransform.transform(payload);
        const createdNeed = await this.needsRepository.createOne(cleanPayload);
        //push createdNeed to parent sync-ly
        this.utilNeedsService.pushToParent(createdNeed._id, parent);
        return createdNeed;
    }

}