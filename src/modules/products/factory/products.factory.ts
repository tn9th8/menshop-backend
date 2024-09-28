import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateProductDto } from "../dto/create-product.dto";
import { ClocksService } from "../modules/clocks.service";
import { ClothingService } from "../modules/clothing.service";
import { ProductsService } from "../products.service";

export enum ProductsEnum {
    CLOCKS = 'Clocks',
    CLOTHING = 'Clothing',
}

@Injectable()
export class ProductsFactory {
    constructor(
        private readonly clocksService: ClocksService,
        private readonly clothingService: ClothingService,
    ) { }

    async create(type: string, payload: CreateProductDto) {
        switch (type) {
            case ProductsEnum.CLOCKS:
                return this.clocksService.create(payload);
            case ProductsEnum.CLOTHING:
                return this.clothingService.create(payload);
            default:
                throw new BadRequestException(`Invalid Product Type ${type}`);
        }
    }
}