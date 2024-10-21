import { Injectable, NotFoundException } from "@nestjs/common";
import { Level1NeedsService } from "./level1-needs.service";
import { Level2NeedsService } from "./level2-needs.service";
import { Level3NeedsService } from "./level3-needs.service";
import { CreateNeedDto } from "../dto/create-need.dto";
import { NeedLevelEnum } from "src/common/enums/need.enum";
import { DefaultNeedsService } from "./default-needs.service";
import { UpdateNeedDto } from "../dto/update-need.dto";
import { NeedsRepository } from "../needs.repository";
import { IKey } from "src/common/interfaces/index.interface";
import { notFoundIdMessage } from "src/common/utils/exception.util";

@Injectable()
export class NeedsFactory {
    constructor(
        private readonly level1NeedsService: Level1NeedsService,
        private readonly level2NeedsService: Level2NeedsService,
        private readonly level3NeedsService: Level3NeedsService,
        private readonly defaultNeedsService: DefaultNeedsService,
        private readonly needsRepository: NeedsRepository
    ) { }

    async createOne(payload: CreateNeedDto) {
        const { level } = payload; //undefined
        switch (level) {
            case NeedLevelEnum.LV1:
                return this.level1NeedsService.createOne(payload);
            case NeedLevelEnum.LV2:
                return this.level2NeedsService.createOne(payload);
            case NeedLevelEnum.LV3:
                return this.level3NeedsService.createOne(payload);
            default:
                return this.defaultNeedsService.createOne(payload);
        }
    }

    async updateOne(needId: IKey, payload: UpdateNeedDto) {
        const foundNeed = await this.needsRepository.findLeanById(needId, ['level'])
        if (!!foundNeed) {
            throw new NotFoundException(notFoundIdMessage('id param', needId));
        }
        switch (foundNeed.level) {
            case NeedLevelEnum.LV1:
                return this.level1NeedsService.updateOne(needId, payload);
            case NeedLevelEnum.LV2:
                return this.level2NeedsService.updateOne(needId, payload);
            case NeedLevelEnum.LV3:
                return this.level3NeedsService.updateOne(needId, payload);
            default:
                return this.defaultNeedsService.updateOne(needId, payload);
        }
    }
}