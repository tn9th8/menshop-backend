import { Injectable } from "@nestjs/common";
import { CreateNeedDto } from "../dto/create-need.dto";
import { UpdateNeedDto } from "../dto/update-need.dto";
import { NeedsRepository } from "../needs.repository";


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