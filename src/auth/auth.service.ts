import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isMatchPass } from 'src/common/utils/security.util';
import { UsersService } from 'src/modules/users/users.service';
import { ProfileDto } from './dto/profile.dto';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async signIn(signInDto: SignInDto): Promise<ProfileDto> {
    const { _id, email, password: hash, name, phone } = await this.usersService.findOneByEmail(signInDto.username);

    if (!isMatchPass(signInDto.password, hash)) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: _id, // be consistent with JWT standards
      iss: 'from server',
      name,
      email,
      phone,
    }

    return {
      access_token: await this.jwtService.signAsync(payload),
      name,
      email,
      phone,
    };
  }

}
