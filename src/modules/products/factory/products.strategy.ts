import { ProductAttributeDto } from "../dto/nested-types.dto";
import { IProduct } from "../schemas/product.schema";

export interface IProductsStrategy {
    isValidAttrs(attributes: ProductAttributeDto[]): boolean;
}