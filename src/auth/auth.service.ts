import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isMatchPass } from 'src/common/utils/security.util';
import { IUser } from 'src/modules/users/interfaces/user.interface';
import { UsersService } from 'src/modules/users/users.service';
import { AuthUserDto } from './dto/auth-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(username: string, pass: string): Promise<AuthUserDto | null> {
    const user = await this.usersService.findOneByEmail(username);
    if (user && isMatchPass(pass, user.password)) {
      return {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      };
    }
    return null;
  }

  async signIn(user: AuthUserDto): Promise<{ access_token: string, user: AuthUserDto }> {
    const payload = {
      sub: user.id, // be consistent with JWT standards
      iss: 'from the menshop server',
      user,
    }
    return {
      access_token: await this.jwtService.signAsync(payload),
      user,
    };
  }

}
