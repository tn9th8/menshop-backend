import { Injectable } from "@nestjs/common";
import { SuperAdminsService } from "./super-admins.service";
import { NormalAdminsService } from "./normal-admins.service";
import { MallSellersService } from "./mall-sellers.service";
import { NormalSellersService } from "./normal-sellers.service";
import { VipClientsService } from "./vip-clients.service";
import { NormalClientsService } from "./normal-clients.service";
import { CustomEmployeesService } from "./custom-employees.service";
import { RolesService } from "src/modules/roles/roles.service";

@Injectable()
export class UsersFactory {
    constructor(
        private readonly rolesService: RolesService,
        private readonly superAdminsService: SuperAdminsService,
        private readonly normalAdminsService: NormalAdminsService,
        private readonly mallSellersService: MallSellersService,
        private readonly normalSellersService: NormalSellersService,
        private readonly customEmployeesService: CustomEmployeesService,
        private readonly vipClientsService: VipClientsService,
        private readonly normalClientsService: NormalClientsService,
    ) { }

    async createUser(body: any) {
        const foundRole = await this.rolesService.findRoleForUser(body.role);
        switch (foundRole.name) {
            case 'normal client':
                return await this.normalClientsService.createOne(body);
            case 'normal seller':
                return await this.normalSellersService.createOne(body);
            case 'normal admin':
                return await this.normalAdminsService.createOne(body);
            case 'vip client':
                return await this.vipClientsService.createOne(body);
            case 'mall seller':
                return await this.mallSellersService.createOne(body);
            case 'standard employee':
                return await this.customEmployeesService.createOne(body);
            case 'super admin':
                return await this.superAdminsService.createOne(body);
            default:
                return await this.normalClientsService.createOne(body);
        }
    }
}