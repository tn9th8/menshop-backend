import { ExtractJwt, Strategy as Jwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthUserDto } from '../dto/auth-user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Jwt) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    async validate(payload: any): Promise<AuthUserDto | null> {
        const user: AuthUserDto = payload.user;
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}