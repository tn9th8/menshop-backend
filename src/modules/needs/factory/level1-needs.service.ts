import { Injectable } from "@nestjs/common";
import { NeedsRepository } from "../needs.repository";
import { CreateNeedDto } from "../dto/create-need.dto";
import { CreateNeedTransform } from "../transform/create-need.transform";
import { IUpdateNeedDto, UpdateNeedDto } from "../dto/update-need.dto";
import { IKey } from "src/common/interfaces/index.interface";
import { UpdateNeedTransform } from "../transform/update-need.transform";


@Injectable()
export class Level1NeedsService {
    /*
     * Level 1:
     * - Can have children. If not, []
     * - No parent
     */

    constructor(private readonly needsRepository: NeedsRepository) { }

    async createOne(payload: CreateNeedDto) {
        const { parent, ...cleanPayload } = payload;
        const createdNeed = await this.needsRepository.createOne(cleanPayload);
        return createdNeed;
    }

    async updateOne(payload: UpdateNeedDto) {
        const { parent, id: needId, ...cleanPayload } = payload;
        const updated = await this.needsRepository.updateOneById(needId, cleanPayload);
        return updated;
    }
}