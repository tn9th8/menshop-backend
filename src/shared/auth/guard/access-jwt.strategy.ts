import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy as Jwt } from 'passport-jwt';
import { JwtEnum } from 'src/common/enums/index.enum';
import { toObjetId } from 'src/common/utils/mongo.util';
import { RolesService } from 'src/modules/roles/roles.service';
import { IAuthUser } from '../../../common/interfaces/auth-user.interface';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(Jwt) {
    constructor(
        private readonly configService: ConfigService,
        private readonly rolesService: RolesService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>(JwtEnum.ACCESS_TOKEN_SECRET),
        });
    }

    async validate(payload: any): Promise<IAuthUser | null> {
        const user: IAuthUser = payload.user;
        if (!user || !user?.roles)
            throw new UnauthorizedException("Xác thực không thành công: Token không hợp lệ");
        const { id, name, phone, email, roles = [], groups = [], permissions = [] } = user;
        //find role, group, permissions
        await Promise.all(user.roles.map(async (item, index) => {
            const roleDoc = await this.rolesService.findRoleForAuth(toObjetId(item));
            roles[index] = roleDoc._id;
            groups.push(roleDoc.group);
            permissions.push(...roleDoc.permissions as any);
        }));
        //return the auth user
        return { id: toObjetId(id), name, phone, email, roles, groups, permissions };
    }
}