
import { IKey } from "src/common/interfaces/index.interface";
import { PermissionDoc } from "src/modules/permissions/schemas/permission.schema";
import { User } from "src/modules/users/schemas/user.schema";

export interface IAuthUser extends Pick<User, 'name' | 'email' | 'phone' | 'roles'> {
    id: IKey;
    groups?: string[];
    permissions?: Pick<PermissionDoc, '_id' | 'apiMethod' | 'apiPath'>[];
}
