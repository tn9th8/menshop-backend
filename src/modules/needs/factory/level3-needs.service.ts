import { Injectable } from "@nestjs/common";
import { CreateNeedDto } from "../dto/create-need.dto";
import { NeedsRepository } from "../needs.repository";
import { CreateNeedTransform } from "../transform/create-need.transform";
import { UtilNeedsService } from "./util-needs.service";


@Injectable()
export class Level3NeedsService {
    /*
    * Level 3:
    * - No children, default []
    * - Can have parent
    */

    constructor(
        private readonly needsRepository: NeedsRepository,
        private readonly createNeedTransform: CreateNeedTransform,
        private readonly utilNeedsService: UtilNeedsService,
    ) { }


    async createOne(payload: CreateNeedDto) {
        const { parent, children, ...cleanPayload } = await this.createNeedTransform.transform(payload);
        const createdNeed = await this.needsRepository.createOne(cleanPayload);
        //push createdNeed to parent sync-ly
        this.utilNeedsService.pushToParent(createdNeed._id, parent);
        return createdNeed;
    }

}