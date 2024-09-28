import { Strategy as Local } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AuthUserDto } from '../dto/auth-user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Local) {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(username: string, password: string): Promise<AuthUserDto | null> {
        const user = await this.authService.validateLocal(username, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}