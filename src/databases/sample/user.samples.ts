import { ConfigService } from "@nestjs/config";
import { hashPass } from "src/common/utils/security.util";

export const USER_SAMPLES = async (configService: ConfigService) => {
    const password = await hashPass(configService.get<string>('INIT_PASSWORD'));
    return [
        {
            name: "I'm a super admin",
            phone: "094699009900",
            email: "admin@menshop.com",
            password
        },
        {
            name: "I'm a shop seller",
            phone: "0946880880",
            email: "shop@menshop.com",
            shop: "66fe7af5efc4a95d4f3684f6",
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