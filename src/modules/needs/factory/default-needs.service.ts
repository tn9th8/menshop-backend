import { Injectable } from "@nestjs/common";
import { CreateNeedDto } from "../dto/create-need.dto";
import { Level1NeedsService } from "./level1-needs.service";
import { UpdateNeedDto } from "../dto/update-need.dto";
import { IKey } from "src/common/interfaces/index.interface";

@Injectable()
export class DefaultNeedsService {
    //when level is null => default level is 1
    constructor(private readonly defaultNeedsService: Level1NeedsService) { }

    async createOne(payload: CreateNeedDto) {
        const result = await this.defaultNeedsService.createOne(payload);
        return result;
    }

    async updateOne(needId: IKey, payload: UpdateNeedDto) {
        const result = await this.defaultNeedsService.updateOne(needId, payload);
        return result;
    }
}