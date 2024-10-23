import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { AuthUserDto } from "./dto/auth-user.dto";
import ms from "ms";
import { Jwt } from "src/common/enums/jwt.enum";
import moment from "moment";

@Injectable()
export class AuthServiceHelper {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    async genTokenPair(user: AuthUserDto):
        Promise<{ accessToken: string, refreshToken: string }> {

        const payload = {
            sub: user.id, // be consistent with JWT standards
            iss: 'from the menshop server',
            user,
        }

        const accessToken = await this.jwtService.signAsync(payload,
            {
                secret: this.configService.get<string>(Jwt.ACCESS_TOKEN_SECRET),
                expiresIn: ms(this.configService.get<string>(Jwt.ACCESS_TOKEN_EXPIRES))
            }
        );

        const refreshToken = await this.jwtService.signAsync(payload,
            {
                secret: this.configService.get<string>(Jwt.REFRESH_TOKEN_SECRET),
                expiresIn: ms(this.configService.get<string>(Jwt.REFRESH_TOKEN_EXPIRES))
            }
        );

        return {
            accessToken,
            refreshToken
        };
    }

    async genVerifyToken(user: AuthUserDto):
        Promise<string> {

        const payload = {
            sub: user.id, // be consistent with JWT standards
            iss: 'from the menshop server',
            user,
        }

        const verifyToken = await this.jwtService.signAsync(payload,
            {
                secret: this.configService.get<string>(Jwt.VERIFY_TOKEN_SECRET),
                expiresIn: ms(this.configService.get<string>(Jwt.VERIFY_TOKEN_EXPIRES))
            }
        );

        return verifyToken;
    }

    async genTokenRSA(payload: any, privateKey: string, expiresIn: number)
        : Promise<string> {

        const token = await this.jwtService.signAsync(payload,
            {
                algorithm: 'RS256',
                privateKey,
                expiresIn
            }
        );
        return token;
    };

    async verifyRefreshToken(refreshToken: string)
        : Promise<AuthUserDto> {
        const payload = await this.jwtService.verifyAsync(refreshToken,
            {
                secret: this.configService.get<string>(Jwt.REFRESH_TOKEN_SECRET)
            },
        );
        return payload.user;
    }

    async verifyVerifyToken(verifyToken: string)
        : Promise<AuthUserDto> {
        const payload = await this.jwtService.verifyAsync(verifyToken,
            {
                secret: this.configService.get<string>(Jwt.VERIFY_TOKEN_SECRET)
            },
        );
        return payload.user;
    }
}