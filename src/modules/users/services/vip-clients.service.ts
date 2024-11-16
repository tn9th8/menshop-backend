import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../users.repository";
import { UserKeysService } from "src/modules/user-keys/user-keys.service";
import { RolesService } from "src/modules/roles/roles.service";
import { ShopsService } from "src/modules/shops/shops.service";

@Injectable()
export class VipClientsService {
    constructor(
        private readonly usersRepo: UsersRepository,
        private readonly userKeysService: UserKeysService,
        private readonly rolesService: RolesService,
        private readonly shopsService: ShopsService,
    ) { }

    async createOne(body: any) {
        throw new Error("Method not implemented.");
    }
}