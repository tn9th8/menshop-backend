import { SortEnum } from "src/common/enums/index.enum";
import { IKey } from "src/common/interfaces/index.interface";


export class QueryProductDto {
    //page
    page?: number;
    limit?: number;
    sort?: SortEnum;
    //attr
    name?: string; //price, discountPrice, discount;
    //ref
    categories?: IKey;
    needs?: IKey;
    shop?: IKey;
}

export class IQueryProduct extends QueryProductDto {
    isActive?: boolean;
    isPublished?: boolean;
}
