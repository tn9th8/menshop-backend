import { Strategy as Local } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AuthUserDto } from '../dto/auth-user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Local) {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(username: string, password: string): Promise<AuthUserDto> {
        return await this.authService.validateLocal(username, password);
    }
}