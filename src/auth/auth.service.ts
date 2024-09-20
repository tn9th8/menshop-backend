import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import mongoose from 'mongoose';
import ms from 'ms';
import { Jwt } from 'src/common/enums/jwt.enum';
import { IUpdateResult } from 'src/common/interfaces/persist-result.interface';
import { isMatchPass } from 'src/common/utils/security.util';
import { UsersService } from 'src/modules/users/users.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) { }

  async validateLocal(username: string, pass: string): Promise<AuthUserDto | null> {
    const user = await this.usersService.findByEmail(username);
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

  async generateTokenPair(user: AuthUserDto): Promise<{ access_token: string, refresh_token: string }> {
    const shortPayload = {
      sub: user.id, // be consistent with JWT standards
      iss: 'from the menshop server',
    }

    const userPayload = {
      ...shortPayload,
      user,
    }

    const generateRefreshToken = async (payload: any): Promise<string> => {
      return await this.jwtService.signAsync(payload,
        {
          secret: this.configService.get<string>(Jwt.REFRESH_TOKEN_SECRET),
          expiresIn: ms(this.configService.get<string>(Jwt.REFRESH_TOKEN_EXPIRES)) / 1000, //seconds
        }
      );
    };

    return {
      access_token: await this.jwtService.signAsync(userPayload),
      refresh_token: await generateRefreshToken(shortPayload),
    };
  }

  async signIn(user: AuthUserDto, response: Response): Promise<{ access_token: string, user: AuthUserDto }> {
    // generate tokens
    const { access_token, refresh_token } = await this.generateTokenPair(user);

    // update a refresh token
    this.usersService.updateRefreshToken(
      user.id,
      refresh_token,
      ms(this.configService.get<string>(Jwt.REFRESH_TOKEN_EXPIRES)));

    // set the token to cookie
    response.cookie('refresh_token', refresh_token,
      {
        httpOnly: true,
        maxAge: ms(this.configService.get<string>(Jwt.REFRESH_TOKEN_EXPIRES)),
      }
    );

    return { access_token, user };
  }

  async signOut(user: AuthUserDto, response: Response): Promise<IUpdateResult> {
    response.clearCookie('refresh_token');
    return await this.usersService.updateRefreshToken(user.id, null, null);

  }

  async refreshAccount(refreshToken: string, response: Response): Promise<{ access_token: string, user: AuthUserDto }> {
    // is exist token
    const user = await this.usersService.findByRefreshToken(refreshToken);
    if (!(refreshToken && user.refreshExpires)) {
      throw new ForbiddenException(`Token không hợp lệ. Vui lòng Sign in`);
    }

    try {
      // verify and decode
      const payload = await this.jwtService.verifyAsync(
        refreshToken,
        { secret: this.configService.get<string>(Jwt.REFRESH_TOKEN_SECRET) },
      );

      // is match id
      if (payload.sub === user._id) {
        throw new ForbiddenException(`Token không hợp lệ. Vui lòng Sign in`);
      }
      response.clearCookie('refresh_token');
      return this.signIn(payload.user, response);

    } catch (error) {
      throw new ForbiddenException(`Token không hợp lệ. Vui lòng Sign in`);
    }
  }

  async generateVerifyToken(id: mongoose.Types.ObjectId): Promise<string> {
    //todo: generateToken by applying strategy pattern
    const shortPayload = {
      sub: id, // be consistent with JWT standards
      iss: 'from the menshop server',
    }

    const verifyToken = await this.jwtService.signAsync(shortPayload,
      {
        secret: this.configService.get<string>(Jwt.VERIFY_TOKEN_SECRET),
        expiresIn: ms(this.configService.get<string>(Jwt.VERIFY_TOKEN_EXPIRES)) / 1000, //seconds
      }
    );
    return verifyToken;
  }

  async signUp(signUpDto: SignUpDto) {
    // create a user
    const result = await this.usersService.create(signUpDto);

    // update a verify token //todo: apply strategy pattern
    const verify_token = await this.generateVerifyToken(result.id);
    this.usersService.updateVerifyToken(
      result.id,
      verify_token,
      ms(this.configService.get<string>(Jwt.VERIFY_TOKEN_EXPIRES)));

    // send a verify link //todo: nexturl
    const verifyLink = this.configService.get<string>('DOMAIN') + '/auth/verify-email?key=' + verify_token;
    this.mailService.sendVerifyLink(signUpDto, verifyLink)

    return verifyLink;
  }


}
