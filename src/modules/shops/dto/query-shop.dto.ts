import { SortEnum } from "src/common/enums/index.enum";
import { IKey } from "src/common/interfaces/index.interface";


export class QueryShopDto {
    //page
    page?: number;
    limit?: number;
    sort?: SortEnum;
    //attr
    name?: string;
    isMall?: boolean;
    //ref
    seller?: IKey;
}

export interface IQueryShop extends QueryShopDto {
    isActive?: boolean;
}
