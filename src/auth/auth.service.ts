import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import ms from 'ms';
import { Jwt } from 'src/common/enums/jwt.enum';
import { isMatchPass } from 'src/common/utils/security.util';
import { MailsService } from 'src/mails/mails.service';
import { KeyStoreService } from 'src/modules/key-store/key-store.service';
import { UsersService } from 'src/modules/users/users.service';
import { AuthServiceHelper } from './auth.service.helper';
import { AuthUserDto } from './dto/auth-user.dto';
import { SignUpClientDto } from './dto/signup-client.dto';
import { SignUpSellerDto } from './dto/signup-seller.dto';
import { SignUpSellerTransform } from './transform/signup-seller.transform';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly keyStoreService: KeyStoreService,
    private readonly configService: ConfigService,
    private readonly mailService: MailsService,
    private readonly signUpSellerTransform: SignUpSellerTransform,
    private readonly authServiceHelper: AuthServiceHelper
  ) { }

  //SIGN UP //todo: transaction
  async signUpSeller(payload: SignUpSellerDto) {
    try {
      //create a seller
      payload = await this.signUpSellerTransform.transform(payload);
      const createdUser = await this.usersService.createSeller(payload);
      if (!createdUser) {
        throw new BadRequestException("Có lỗi khi tạo một seller");
      }
      const { _id: userId, name, email, phone } = createdUser;
      const authUser = { id: userId, name, email, phone };
      //create a verify token
      const verifyToken = await this.authServiceHelper.genVerifyToken(authUser);
      const createdKeyStore = await this.keyStoreService.createOne({ userId, verifyToken });
      if (!createdKeyStore) {
        throw new BadRequestException("Có lỗi khi cập nhật một keyStore");
      }
      // send a verify link
      const verifyLink =
        this.configService.get<string>('DOMAIN') + '/api/v1' + '/admin/auth/verify-email?token=' + verifyToken;
      this.mailService.sendVerifyLink({ email, name }, verifyLink);

      return createdUser;
    } catch (error) {
      console.log(error);
      throw new BadRequestException("Có lỗi trong quá trình tạo một seller");
    }
  }

  async signUpClient(payload: SignUpClientDto) {
    try {
      //create a seller
      //transform
      const createdUser = await this.usersService.createClient(payload);
      if (!createdUser) {
        throw new BadRequestException("Có lỗi khi tạo một client");
      }
      const { _id: userId, name, email, phone } = createdUser;
      const authUser = { id: userId, name, email, phone };
      //create a verify token
      const verifyToken = await this.authServiceHelper.genVerifyToken(authUser);
      const createdKeyStore = await this.keyStoreService.createOne({ userId, verifyToken });
      if (!createdKeyStore) {
        throw new BadRequestException("Có lỗi khi cập nhật một keyStore");
      }
      //send a verify link
      const verifyLink =
        this.configService.get<string>('DOMAIN') + '/api/v1' + 'client/auth/verify-email?token=' + verifyToken;
      this.mailService.sendVerifyLink({ email, name }, verifyLink);

      return createdUser;
    } catch (error) {
      console.log(error);
      throw new BadRequestException("Có lỗi trong quá trình tạo một client");
    }
  }

  //SIGN IN with USERNAME-PASS
  async validateLocal(username: string, pass: string)
    : Promise<AuthUserDto> {
    //is exist email and is right pass
    const foundUser = await this.usersService.findByEmail(username) || null;
    if (!foundUser) {
      throw new ForbiddenException("Username hoặc Password không đúng");;
    }
    const { _id: id, name, email, phone, password } = foundUser;
    if (!(await isMatchPass(pass, password))) {
      throw new ForbiddenException("Username hoặc Password không đúng");
    }

    return { id, name, email, phone };
  }

  //SIGN IN with generate KEYSTORE
  async signIn(authUser: AuthUserDto, response: Response)
    : Promise<{ accessToken: string, user: AuthUserDto }> {

    //create a token pair
    const { accessToken, refreshToken } =
      await this.authServiceHelper.genTokenPair(authUser);
    const updatedKeyStore =
      await this.keyStoreService.updateRefreshToken({ userId: authUser.id, refreshToken });
    if (!updatedKeyStore?.updatedCount) {
      throw new BadRequestException("Có lỗi khi cập nhật một keyStore");
    }
    // set cookie
    response.cookie('refreshToken', refreshToken,
      {
        httpOnly: true,
        maxAge: ms(this.configService.get<string>(Jwt.REFRESH_TOKEN_EXPIRES)),
      }
    );
    //return
    return {
      accessToken,
      user: authUser as any
    };
  }

  async signOut(user: AuthUserDto, response: Response)
    : Promise<any> {
    response.clearCookie('refreshToken');
    //no need clear refresh token
    return;

  }

  async refreshAccount(refreshToken: string, response: Response):
    Promise<{ accessToken: string, user: AuthUserDto }> {
    let user: AuthUserDto;
    try {
      user = await this.authServiceHelper.verifyRefreshToken(refreshToken);
      if (!user) {
        throw new ForbiddenException("Token không hợp lệ");
      }
      response.clearCookie('refreshToken');
    } catch (error) {
      throw new ForbiddenException(`Token không hợp lệ`);
    }

    //create a token pair
    const { accessToken, refreshToken: newRefreshToken } =
      await this.authServiceHelper.genTokenPair(user);
    const updatedKeyStore =
      await this.keyStoreService.updateRefreshToken({ userId: user.id, refreshToken });
    if (!updatedKeyStore?.updatedCount) {
      throw new BadRequestException("Có lỗi khi cập nhật một keyStore");
    }
    // set cookie
    response.cookie('refreshToken', refreshToken,
      {
        httpOnly: true,
        maxAge: ms(this.configService.get<string>(Jwt.REFRESH_TOKEN_EXPIRES)),
      }
    );
    return { accessToken, user };
  }

  async verifyEmail(verifyToken: string): Promise<boolean> {
    let user: AuthUserDto;
    try {
      user = await this.authServiceHelper.verifyVerifyToken(verifyToken);
      if (!user) {
        return false
      }
    } catch (error) {
      console.log(error);
      return false;

    }
    return true;
  }

}
