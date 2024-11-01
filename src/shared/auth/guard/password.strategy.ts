import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as Local } from 'passport-local';
import { AuthService } from '../auth.service';
import { AuthUserDto } from '../dto/auth-user.dto';

@Injectable()
export class PasswordStrategy extends PassportStrategy(Local) {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(username: string, password: string): Promise<AuthUserDto> {
        return await this.authService.validateLocal(username, password);
    }
}