import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as Jwt } from 'passport-jwt';
import { JwtEnum } from 'src/common/enums/index.enum';
import { toObjetId } from 'src/common/utils/mongo.util';
import { extractRefreshToken } from 'src/common/utils/security.util';
import { IAuthUser } from '../../../common/interfaces/auth-user.interface';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Jwt, 'jwt-refresh') {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: extractRefreshToken,
            ignoreExpiration: false,
            secretOrKey: configService.get<string>(JwtEnum.REFRESH_TOKEN_SECRET),
        });
    }

    async validate(payload: any): Promise<IAuthUser | null> {
        const user: IAuthUser = payload.user;
        if (!user)
            throw new UnauthorizedException("Xác thực không thành công: Token không hợp lệ");
        const { id, name, phone, email, roles = [] } = user;
        return { id: toObjetId(id), name, phone, email, roles };
    }
}