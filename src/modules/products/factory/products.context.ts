import { Injectable } from "@nestjs/common";
import { ProductsEnum } from "src/common/enums/product.enum";
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
        ProductsContext.register(ProductsEnum.TOPS, this.topsService);
        ProductsContext.register(ProductsEnum.WATCHES, this.watchesService);
    }

    static register(name: ProductsEnum, strategy: IProductsStrategy) {
        this.context[name] = strategy;
    }
}