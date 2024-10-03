import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateProductDto } from "../dto/create-product.dto";
import { ProductsConfig } from "./products.config";

@Injectable()
export class ProductsFactory {
    constructor(private readonly productsConfig: ProductsConfig) { }

    async create(createProductDto: CreateProductDto) {
        //todo: any
        const { product_type } = (createProductDto as any);
        const productProvider = ProductsConfig.context[product_type];
        if (!productProvider) { throw new BadRequestException(`Invalid Product Type: ${product_type}`); }
        return productProvider.create(createProductDto);
    }
}
