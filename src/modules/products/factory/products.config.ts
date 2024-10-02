import { Injectable } from "@nestjs/common";
import { ProductsEnum } from "src/common/enums/product.enum";
import { ClocksService } from "../types/clocks.service";
import { ClothingsService } from "../types/clothings.service";
import { IProductsStrategy } from "../types/strategy/products.stategy";



@Injectable()
export class ProductsConfig {
    static context: { [type: string]: IProductsStrategy } = {}; // key-dependency

    constructor(
        private readonly clocksService: ClocksService,
        private readonly clothingsService: ClothingsService,
    ) {
        ProductsConfig.register(ProductsEnum.CLOTHINGS, this.clothingsService);
        ProductsConfig.register(ProductsEnum.CLOCKS, this.clocksService);
    }

    static register(type: ProductsEnum, provider: IProductsStrategy) {
        this.context[type] = provider;
    }
}