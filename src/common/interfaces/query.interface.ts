import { SortEnum } from "../enums/index.enum";

export interface IPageQuery {
    page: number;
    limit: number;
    sort: SortEnum;
}