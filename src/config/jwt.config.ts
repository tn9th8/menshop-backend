import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModuleAsyncOptions } from "@nestjs/jwt";
import ms from "ms";
import { JwtEnum } from "src/common/enums/index.enum";

/**
 * @desc config jwt module for auth module
 */
export const JwtConfig: JwtModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(JwtEnum.ACCESS_TOKEN_SECRET),
        signOptions: { expiresIn: ms(configService.get<string>(JwtEnum.ACCESS_TOKEN_EXPIRES)) / 1000 }, //seconds
    }),
}