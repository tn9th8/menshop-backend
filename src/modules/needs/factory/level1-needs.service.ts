import { Injectable } from "@nestjs/common";
import { NeedsRepository } from "../needs.repository";
import { CreateNeedDto } from "../dto/create-need.dto";
import { CreateNeedTransform } from "../transform/create-need.transform";
import { UpdateNeedDto } from "../dto/update-need.dto";
import { IKey } from "src/common/interfaces/index.interface";


@Injectable()
export class Level1NeedsService {
    /*
     * Level 1:
     * - Can have children. If not, []
     * - No parent
     */

    constructor(
        private readonly needsRepository: NeedsRepository,
        private readonly createNeedTransform: CreateNeedTransform
    ) { }

    async createOne(payload: CreateNeedDto) {
        const { parent, ...cleanPayload } = await this.createNeedTransform.transform(payload);
        const createdNeed = await this.needsRepository.createOne(cleanPayload);
        return createdNeed;
    }

    async updateOne(needId: IKey, payload: UpdateNeedDto) {

    }
}