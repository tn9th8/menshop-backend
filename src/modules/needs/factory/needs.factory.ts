import { Injectable } from "@nestjs/common";
import { NeedLevelEnum } from "src/common/enums/need.enum";
import { CreateNeedDto } from "../dto/create-need.dto";
import { IUpdateNeedDto } from "../dto/update-need.dto";
import { DefaultNeedsService } from "./default-needs.service";
import { Level1NeedsService } from "./level1-needs.service";
import { Level2NeedsService } from "./level2-needs.service";
import { Level3NeedsService } from "./level3-needs.service";

@Injectable()
export class NeedsFactory {
    constructor(
        private readonly level1NeedsService: Level1NeedsService,
        private readonly level2NeedsService: Level2NeedsService,
        private readonly level3NeedsService: Level3NeedsService,
        private readonly defaultNeedsService: DefaultNeedsService,
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

    async updateOne(payload: IUpdateNeedDto) {
        const { level, ...newPayload } = payload;
        switch (level) {
            case NeedLevelEnum.LV1:
                return this.level1NeedsService.updateOne(newPayload);
            case NeedLevelEnum.LV2:
                return this.level2NeedsService.updateOne(newPayload);
            case NeedLevelEnum.LV3:
                return this.level3NeedsService.updateOne(newPayload);
            default:
                return this.defaultNeedsService.updateOne(newPayload);
        }
    }
}