import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateProductDto } from "../dto/create-product.dto";
import { ProductsContext } from "./products.context";
import { ProductAttributeDto } from "../dto/nested-types.dto";
import { Types } from "mongoose";
import { ProductTypeEnum } from "src/common/enums/product.enum";


@Injectable()
export class ProductsFactory {
    constructor(private readonly productsContext: ProductsContext) { }

    isValidAttrs(attributes: ProductAttributeDto[], categories: Types.ObjectId[]) {
        //todo u1: findCatesById => get cate level 1 => get cate.name to assign type
        const type = ProductTypeEnum.TOPS;
        const productStrategy = ProductsContext.getStrategy(type);
        return productStrategy.isValidAttrs(attributes);
    }
}
