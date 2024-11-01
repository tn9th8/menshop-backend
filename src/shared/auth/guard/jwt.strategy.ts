import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy as JsonWebToken } from 'passport-jwt';
import { Jwt } from 'src/common/enums/index.enum';
import { AuthUserDto } from '../dto/auth-user.dto';
import { toObjetId } from 'src/common/utils/mongo.util';
import { RolesService } from 'src/modules/roles/roles.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(JsonWebToken) {
    constructor(
        private readonly configService: ConfigService,
        private readonly rolesService: RolesService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>(Jwt.ACCESS_TOKEN_SECRET),
        });
    }

    async validate(payload: any): Promise<AuthUserDto | null> {
        const user: AuthUserDto = { ...payload.user, id: toObjetId(payload.user.id) };
        if (!user) {
            throw new ForbiddenException("Xác thực không thành công: Token không hợp lệ");
        }
        //const role = this.rolesService.findRole()
        return user;
    }
}