import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { createErrorMessage, isExistMessage } from "src/common/utils/exception.util";
import { hashPass } from "src/common/utils/security.util";
import { UserKeysService } from "src/modules/user-keys/user-keys.service";
import { UsersRepository } from "../users.repository";
import { SignUpClientDto } from "src/shared/auth/dto/signup-client.dto";
import { CartsService } from "src/modules/cart/carts.service";
import { RoleIdEnum } from "src/shared/databases/sample/role.samples";
import { toObjetId } from "src/common/utils/mongo.util";

@Injectable()
export class NormalClientsService {

    constructor(
        private readonly usersRepo: UsersRepository,
        private readonly userKeysService: UserKeysService,
        private readonly cartService: CartsService
    ) { }

    async createOne(body: any | SignUpClientDto) {
        //mail not exist
        const { email, password } = body;
        const isExist = await this.usersRepo.isExistByQuery({ email });
        if (isExist)
            throw new ConflictException(isExistMessage('email'));
        //role normal client
        const roles = [toObjetId(RoleIdEnum.NORMAL_CLIENT)];
        //hash password
        const hash = await hashPass(password);
        //create user
        let createdUser = await this.usersRepo.createUser({
            ...body, password: hash, roles
        });
        if (!createdUser)
            throw new BadRequestException(createErrorMessage('user'));
        //create key store
        await this.userKeysService.createOne({ userId: createdUser._id });
        //create cart
        await this.cartService.createCartForUser({ client: createdUser._id });
        //return
        const { password: hide, ...newUser } = createdUser;
        return newUser;
    }
}