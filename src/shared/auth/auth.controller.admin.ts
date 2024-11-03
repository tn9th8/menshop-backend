import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { Cookies } from 'src/common/decorators/cookie.decorator';
import { SkipJwt } from 'src/common/decorators/skip-jwt.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { IAuthUser } from '../../common/interfaces/auth-user.interface';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { PasswordGuard } from './guard/password.guard';
import { RefreshJwtStrategy } from './guard/refresh-jwt.strategy';
import { RefreshToken } from 'src/common/utils/security.util';
import { RefreshJwtGuard } from './guard/refresh-jwt.guard';

@ApiTags('Auth Module for Admin Side')
@Controller('admin/auth')
export class AuthControllerAdmin {
  constructor(private readonly authService: AuthService) { }

  @SkipJwt()
  @UseGuards(PasswordGuard)
  @ApiBody({ type: SignInDto })
  @ApiMessage('sign in')
  @Post('signin')
  signIn(
    @User() user: IAuthUser,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.signIn(user, response);
  }

  @ApiMessage('sign out')
  @Get('signout')
  signOut(
    @User() user: IAuthUser,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.signOut(user, response);
  }

  @SkipJwt()
  @UseGuards(RefreshJwtGuard)
  @ApiMessage('refresh an account')
  @Get('refresh')
  refreshAccount(
    @User() user: IAuthUser,
    @Cookies(RefreshToken) refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.refreshAccount(user, refreshToken, response);
  }

  @ApiMessage('find an account')
  @Get('account')
  getAccount(
    @User() user: IAuthUser
  ) {
    return user;
  }
}

