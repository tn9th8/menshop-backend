import { Injectable } from "@nestjs/common";
import { ProductTypeEnum } from "src/common/enums/product.enum";
import { TopsService } from "../types/tops/tops.service";
import { IProductsStrategy } from "./products.strategy";
import { WatchesService } from "../types/watches/watches.service";
import { CustomService } from "../types/custom/custom.service";



@Injectable()
export class ProductsContext {
    static context: { [name: string]: IProductsStrategy } = {}; // key-value : type-service

    constructor(
        private readonly watchesService: WatchesService,
        private readonly topsService: TopsService,
        private readonly customService: CustomService,
    ) {
        ProductsContext.register(ProductTypeEnum.TOPS, this.topsService);
        ProductsContext.register(ProductTypeEnum.WATCHES, this.watchesService);
        ProductsContext.register(ProductTypeEnum.CUSTOM, this.customService);
    }

    static register(name: ProductTypeEnum, strategy: IProductsStrategy) {
        this.context[name] = strategy;
    }

    static getStrategy(type: string) {
        const productStrategy = this.context[type];
        if (!productStrategy) {
            return this.context[ProductTypeEnum.CUSTOM];
        }
        return productStrategy;
    }
}