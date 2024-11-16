import { UserGenderEnum } from "src/modules/users/enum/user.enum";
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
    gender?: UserGenderEnum;
}

export interface IQueryUser extends QueryUserDto {
    isActive?: boolean;
}
