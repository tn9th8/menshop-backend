import { Injectable } from "@nestjs/common";
import { ProductTypeEnum } from "src/common/enums/product-type.enum";
import { WatchesService } from "../types/watches/watches.service";
import { TopsService } from "../types/tops/tops.service";
import { IProductsStrategy } from "./products.strategy";



@Injectable()
export class ProductsContext {
    static context: { [name: string]: IProductsStrategy } = {}; // key-value : type-service

    constructor(
        private readonly watchesService: WatchesService,
        private readonly topsService: TopsService,
    ) {
        ProductsContext.register(ProductTypeEnum.TOPS, this.topsService);
        ProductsContext.register(ProductTypeEnum.WATCHES, this.watchesService);
    }

    static register(name: ProductTypeEnum, strategy: IProductsStrategy) {
        this.context[name] = strategy;
    }
}