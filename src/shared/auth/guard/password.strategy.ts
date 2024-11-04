import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as Local } from 'passport-local';
import { AuthService } from '../auth.service';
import { IAuthUser } from '../../../common/interfaces/auth-user.interface';
import { UsersService } from 'src/modules/users/users.service';
import { isMatchPass } from 'src/common/utils/security.util';
import { toObjetId } from 'src/common/utils/mongo.util';

@Injectable()
export class PasswordStrategy extends PassportStrategy(Local) {
    constructor(private readonly usersService: UsersService) {
        super();
    }

    async validate(username: string, password: string): Promise<IAuthUser> {
        //exist email and right pass
        const foundUser = await this.usersService.findByEmail(username);
        if (!foundUser) {
            throw new UnauthorizedException("Username hoặc Password không đúng");;
        }
        const { _id: id, name, email, phone, password: rightPass, roles } = foundUser;
        if (!(await isMatchPass(password, rightPass))) {
            throw new UnauthorizedException("Username hoặc Password không đúng");
        }
        return { id: toObjetId(id), name, email, phone, roles };
    }
}