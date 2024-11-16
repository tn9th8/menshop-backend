import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { createErrorMessage, isExistMessage } from "src/common/utils/exception.util";
import { toObjetIds } from "src/common/utils/mongo.util";
import { hashPass } from "src/common/utils/security.util";
import { UserKeysService } from "src/modules/user-keys/user-keys.service";
import { RoleIdEnum } from "src/shared/databases/sample/role.samples";
import { UsersRepository } from "../users.repository";

@Injectable()
export class NormalAdminsService {
    constructor(
        private readonly usersRepo: UsersRepository,
        private readonly userKeysService: UserKeysService
    ) { }

    async createOne(body: any) {
        //mail not exist
        const { email, password } = body;
        const isExist = await this.usersRepo.isExistByQuery({ email });
        if (isExist)
            throw new ConflictException(isExistMessage('email'));
        //role normal admin + normal user
        const roles = toObjetIds([RoleIdEnum.NORMAL_ADMIN, RoleIdEnum.NORMAL_CLIENT]);
        //hash password
        const hash = await hashPass(password);
        //create user
        let createdUser = await this.usersRepo.createUser({
            ...body, password: hash, roles
        });
        if (!createdUser)
            throw new BadRequestException(createErrorMessage('user'));
        //create key store
        const createdUserKey = await this.userKeysService.createOne({ userId: createdUser._id });
        //return
        const { password: hide, ...newUser } = createdUser;
        return newUser;
    }
}