import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { createErrorMessage, isExistMessage } from "src/common/utils/exception.util";
import { toObjetIds } from "src/common/utils/mongo.util";
import { hashPass } from "src/common/utils/security.util";
import { ShopsService } from "src/modules/shops/shops.service";
import { UserKeysService } from "src/modules/user-keys/user-keys.service";
import { SignUpSellerDto } from "src/shared/auth/dto/signup-seller.dto";
import { RoleIdEnum } from "src/shared/databases/sample/role.samples";
import { UsersRepository } from "../users.repository";

@Injectable()
export class NormalSellersService {
    constructor(
        private readonly usersRepo: UsersRepository,
        private readonly userKeysService: UserKeysService,
        private readonly shopsService: ShopsService,
    ) { }

    async createOne(body: any | SignUpSellerDto) {
        //mail not exist
        const { email, password } = body;
        const isExist = await this.usersRepo.isExistByQuery({ email });
        if (isExist)
            throw new ConflictException(isExistMessage('email'));
        //role normal shop + normal client
        const roles = toObjetIds([RoleIdEnum.NORMAL_SELLER, RoleIdEnum.NORMAL_CLIENT]);
        //hash password
        const hash = await hashPass(password);
        //create user
        let createdUser = await this.usersRepo.createOne({
            ...body, password: hash, roles
        });
        if (!createdUser)
            throw new BadRequestException(createErrorMessage('user'));
        //create key store
        await this.userKeysService.createOne({ userId: createdUser._id });
        //create shop
        await this.shopsService.createShopForUser({
            name: createdUser.name, seller: createdUser._id, image: createdUser.avatar,
            isOpen: true
        });
        //return
        const { password: hide, ...newUser } = createdUser;
        return newUser;
    }
}