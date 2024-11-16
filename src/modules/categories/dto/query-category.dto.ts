import { NeedLevelEnum } from "src/common/enums/need.enum";
import { SortEnum } from "src/common/enums/index.enum";
import { IKey } from "src/common/interfaces/index.interface";


export class QueryCategoryDto {
    //page
    page?: number;
    limit?: number;
    sort?: SortEnum;
    //attr
    name?: string;
    level?: NeedLevelEnum;
    //ref
    children?: IKey;
}

export class IQueryCategory extends QueryCategoryDto {
    isActive?: boolean;
}
