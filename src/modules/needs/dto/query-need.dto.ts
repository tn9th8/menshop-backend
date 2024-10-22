import { NeedLevelEnum } from "src/common/enums/need.enum";
import { NeedSortEnum } from "src/common/enums/sort.enum";
import { IKey } from "src/common/interfaces/index.interface";


export class QueryNeedDto {
    //page
    page?: number;
    limit?: number;
    sort?: NeedSortEnum;
    //attr
    name?: string;
    level?: NeedLevelEnum;
    isPublished?: boolean;
    //ref
    child?: IKey;
}
