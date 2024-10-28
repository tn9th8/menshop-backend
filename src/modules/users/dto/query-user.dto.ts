import { GenderEnum } from "src/common/enums/gender.enum";
import { SortEnum } from "src/common/enums/index.enum";
import { IKey } from "src/common/interfaces/index.interface";


export class QueryUserDto {
    //page
    page?: number;
    limit?: number;
    sort?: SortEnum;
    //attr
    name?: string;
    email?: string;
    phone?: string;
    gender?: GenderEnum;
}

export interface IQueryUser extends QueryUserDto {
    isActive?: boolean;
}
