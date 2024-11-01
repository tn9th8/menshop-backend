import { ConfigService } from "@nestjs/config";
import { toObjetId, toObjetIds } from "src/common/utils/mongo.util";
import { hashPass } from "src/common/utils/security.util";
import { RoleIdEnum } from "./role.samples";
import { GenderEnum } from "src/common/enums/gender.enum";

export enum UserIdEnum {
    SUPER_ADMIN = '6727061983d16f4c24e6af77',
    NORMAL_ADMIN = '672706213859d83a18ffb18b',
    NORMAL_SELLER = '67270632ae2c4884f9d37283',
    NORMAL_CLIENT = '6727062e76df5b6216ac5d8e',
}

export const USER_SAMPLES = async (configService: ConfigService) => {
    const password = await hashPass(configService.get<string>('INIT_PASSWORD'));
    const isActive = true;
    return [
        {
            _id: toObjetId(UserIdEnum.SUPER_ADMIN),
            name: "I'm a super admin",
            phone: "0000989898",
            email: "super@menshop.com",
            roles: toObjetIds([RoleIdEnum.NORMAL_ADMIN, RoleIdEnum.SUPER_ADMIN]),
            age: 20,
            gender: GenderEnum.MALE,
            avatar: 'super-admin-avatar.jpg',
            password,
            isActive
        },
        {
            _id: toObjetId(UserIdEnum.NORMAL_ADMIN),
            name: "I'm a normal admin",
            phone: "0000949494",
            email: "admin@menshop.com",
            roles: toObjetIds([RoleIdEnum.NORMAL_ADMIN]),
            age: 20,
            gender: GenderEnum.MALE,
            avatar: 'normal-admin-avatar.jpg',
            password,
            isActive
        },
        {
            _id: toObjetId(UserIdEnum.NORMAL_SELLER),
            name: "I'm a normal seller",
            phone: "0000545454",
            email: "seller@menshop.com",
            roles: toObjetIds([RoleIdEnum.NORMAL_SELLER]),
            age: 20,
            gender: GenderEnum.FEMALE,
            avatar: 'normal-seller-avatar.png',
            password,
            isActive
        },
        {
            _id: toObjetId(UserIdEnum.NORMAL_CLIENT),
            name: "I'm a normal client",
            phone: "0000141414",
            email: "client@menshop.com",
            roles: toObjetIds([RoleIdEnum.NORMAL_CLIENT]),
            age: 20,
            gender: GenderEnum.MALE,
            avatar: 'normal-client-avatar.jpg',
            password,
            isActive
        }
    ];
};