import { Injectable } from "@nestjs/common";
import { CreateNeedDto } from "../dto/create-need.dto";
import { UpdateNeedDto } from "../dto/update-need.dto";
import { Level1NeedsService } from "./level1-needs.service";

@Injectable()
export class DefaultNeedsService {
    //when level is null => default level is 1
    constructor(private readonly defaultNeedsService: Level1NeedsService) { }

    async createOne(payload: CreateNeedDto) {
        const result = await this.defaultNeedsService.createOne(payload);
        return result;
    }

    async updateOne(payload: UpdateNeedDto) {
        const result = await this.defaultNeedsService.updateOne(payload);
        return result;
    }
}