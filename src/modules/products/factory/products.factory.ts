import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateProductDto } from "../dto/create-product.dto";
import { ProductsContext } from "./products.context";


@Injectable()
export class ProductsFactory {
    constructor(private readonly productsContext: ProductsContext) { }

    isValidAttrs(inputAttributes: [{ name: string }], type: string) {
        const productStrategy = ProductsContext.context[type];
        if (!productStrategy) { throw new BadRequestException(`Invalid Product Type: ${type}`) };
        return productStrategy.isValidAttrs(inputAttributes);
    }
}
