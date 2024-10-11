import { IProduct } from "../schemas/product.schema";

export interface IProductsStrategy {
    isValidAttrs(inputAttrs: [{ name: string }]): boolean;
}