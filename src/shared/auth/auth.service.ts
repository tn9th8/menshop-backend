import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import ms from 'ms';
import { JwtEnum } from 'src/common/enums/index.enum';
import { isMatchPass } from 'src/common/utils/security.util';
import { UserKeysService } from 'src/modules/user-keys/user-keys.service';
import { UsersService } from 'src/modules/users/users.service';
import { MailsService } from 'src/shared/mails/mails.service';
import { IAuthUser } from '../../common/interfaces/auth-user.interface';
import { SignUpClientDto } from './dto/signup-client.dto';
import { SignUpSellerDto } from './dto/signup-seller.dto';
import { AuthHelper } from './helper/auth.helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly userKeysService: UserKeysService,
    private readonly configService: ConfigService,
    private readonly mailService: MailsService,
    private readonly authHelper: AuthHelper
  ) { }

  //SIGN UP //todo: transaction
  async signUpSeller(payload: SignUpSellerDto) {
    try {
      //create a seller
      const createdUser = await this.usersService.createSeller(payload);
      if (!createdUser)
        throw new BadRequestException("Có lỗi khi tạo một seller");
      const { _id: userId, name, email, phone, roles } = createdUser;
      const authUser = { id: userId, name, email, phone, roles };
      //create a verify token
      const verifyToken = await this.authHelper.genVerifyToken(authUser);
      const createdUserKey = await this.userKeysService.createOne({ userId, verifyToken });
      if (!createdUserKey) {
        throw new BadRequestException("Có lỗi khi taoj một userKey");
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
      const createdUser = await this.usersService.createClient(payload);
      if (!createdUser)
        throw new BadRequestException("Có lỗi khi tạo một client");
      const { _id: userId, name, email, phone, roles } = createdUser;
      const authUser = { id: userId, name, email, phone, roles };
      //create a verify token
      const verifyToken = await this.authHelper.genVerifyToken(authUser);
      const createdUserKey = await this.userKeysService.createOne({ userId, verifyToken });
      if (!createdUserKey) {
        throw new BadRequestException("Có lỗi khi tạo một userKey");
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

  //SIGN IN/OUT
  async signIn(user: IAuthUser, response: Response
  ): Promise<{ accessToken: string, user: IAuthUser }> {
    //create a token pair
    const { accessToken, refreshToken } =
      await this.authHelper.genTokenPair(user);
    const updatedUserKey =
      await this.userKeysService.updateRefreshToken({ userId: user.id, refreshToken });
    if (!updatedUserKey?.updatedCount)
      throw new BadRequestException("Có lỗi khi cập nhật một userKey");
    //set cookie
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>(JwtEnum.REFRESH_TOKEN_EXPIRES)),
    });
    //return
    return { accessToken, user: user };
  }

  async signOut(user: IAuthUser, response: Response): Promise<void> {
    const updatedUserKey =
      await this.userKeysService.updateRefreshToken({ userId: user.id, refreshToken: '' });
    if (!updatedUserKey?.updatedCount)
      throw new BadRequestException("Có lỗi khi cập nhật một userKey");
    response.clearCookie('refreshToken');
    return;

  }

  async refreshAccount(user: IAuthUser, refreshToken: string, response: Response
  ): Promise<{ accessToken: string, user: IAuthUser }> {
    //todo: compare refresh token && detect hacker
    //create a token pair
    const { accessToken, refreshToken: newRefreshToken } =
      await this.authHelper.genTokenPair(user);
    const updatedUserKey =
      await this.userKeysService.updateRefreshToken({ userId: user.id, refreshToken: newRefreshToken });
    if (!updatedUserKey?.updatedCount) {
      throw new BadRequestException("Có lỗi khi cập nhật một userKey");
    }
    //set cookie
    response.clearCookie('refreshToken');
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>(JwtEnum.REFRESH_TOKEN_EXPIRES)),
    });
    return { accessToken, user };
  }

  async verifyEmail(verifyToken: string): Promise<boolean> {
    let user: IAuthUser;
    try {
      user = await this.authHelper.verifyVerifyToken(verifyToken);
      if (!user)
        return false
    } catch (error) {
      console.log(error);
      return false;
    }
    return true;
  }

}
