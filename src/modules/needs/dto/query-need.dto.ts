import { NeedLevelEnum } from "src/common/enums/need.enum";
import { SortEnum } from "src/common/enums/index.enum";
import { IKey } from "src/common/interfaces/index.interface";


export class QueryNeedDto {
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

export class IQueryNeed extends QueryNeedDto {
    isPublished?: boolean;
}
