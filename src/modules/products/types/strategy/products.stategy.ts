import { IProduct } from "../../schemas/product.schema";

export interface IProductsStrategy {
    //todo: any
    create(payload: any): Promise<IProduct>;
}