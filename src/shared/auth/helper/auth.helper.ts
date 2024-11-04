import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import ms from "ms";
import { JwtEnum } from "src/common/enums/index.enum";
import { IAuthUser } from "../../../common/interfaces/auth-user.interface";

@Injectable()
export class AuthHelper {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    async genTokenPair(user: IAuthUser): Promise<{ accessToken: string, refreshToken: string }> {
        const payload = { user };
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>(JwtEnum.ACCESS_TOKEN_SECRET),
            expiresIn: ms(this.configService.get<string>(JwtEnum.ACCESS_TOKEN_EXPIRES))
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>(JwtEnum.REFRESH_TOKEN_SECRET),
            expiresIn: ms(this.configService.get<string>(JwtEnum.REFRESH_TOKEN_EXPIRES))
        });
        return { accessToken, refreshToken };
    }

    async genVerifyToken(user: IAuthUser):
        Promise<string> {

        const payload = {
            sub: user.id, // be consistent with JWT standards
            iss: 'from the menshop server',
            user,
        }

        const verifyToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>(JwtEnum.VERIFY_TOKEN_SECRET),
            expiresIn: ms(this.configService.get<string>(JwtEnum.VERIFY_TOKEN_EXPIRES))
        });
        return verifyToken;
    }

    async genTokenRSA(payload: any, privateKey: string, expiresIn: number): Promise<string> {
        const token = await this.jwtService.signAsync(payload, {
            algorithm: 'RS256',
            privateKey,
            expiresIn
        });
        return token;
    };

    async verifyRefreshToken(refreshToken: string): Promise<IAuthUser> {
        const payload = await this.jwtService.verifyAsync(refreshToken, {
            secret: this.configService.get<string>(JwtEnum.REFRESH_TOKEN_SECRET)
        });
        return payload.user;
    }

    async verifyVerifyToken(verifyToken: string): Promise<IAuthUser> {
        const payload = await this.jwtService.verifyAsync(verifyToken, {
            secret: this.configService.get<string>(JwtEnum.VERIFY_TOKEN_SECRET)
        });
        return payload.user;
    }
}