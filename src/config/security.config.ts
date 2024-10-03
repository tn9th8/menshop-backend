import { ConfigModule, ConfigService } from "@nestjs/config";
import ms from "ms";
import { Jwt } from "src/common/enums/jwt.enum";

/**
 * @desc config jwt module for auth module
 */
export const JwtConfig = {
    global: true,
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => (
        {
            secret: configService.get<string>(Jwt.ACCESS_TOKEN_SECRET),
            signOptions: { expiresIn: ms(configService.get<string>(Jwt.ACCESS_TOKEN_EXPIRES)) / 1000 }, //seconds
        }
    ),
}