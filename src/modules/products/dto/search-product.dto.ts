import { ProductSortEnum } from "src/modules/products/enum/product.enum";
import { IKey } from "src/common/interfaces/index.interface";

export class SearchProductDto {
    //page
    page?: number;
    limit?: number;
    sort?: ProductSortEnum;
    //search
    keyword?: string;
    //attr
    name?: string; //price, discountPrice, discount;
    //ref
    categories?: IKey[];
    needs?: IKey;
    shop?: IKey;
}