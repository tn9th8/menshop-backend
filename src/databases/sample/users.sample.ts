import { ConfigService } from "@nestjs/config";
import { hashPass } from "src/common/utils/security.util";

export const INIT_USERS = async (configService: ConfigService) => {
    const password = await hashPass(configService.get<string>('INIT_PASSWORD'));
    return [
        {
            name: "I'm a super admin",
            phone: "094699009900",
            email: "admin@menshop.com",
            password
        },
        {
            name: "I'm a shop manager",
            phone: "0946880880",
            email: "manager@menshop.com",
            password
        },
        {
            name: "I'm a shop staff",
            phone: "094644004400",
            email: "staff@menshop.com",
            password
        },
        {
            name: "I'm a normal member",
            phone: "094611001100",
            email: "member@menshop.com",
            password
        }
    ];
};