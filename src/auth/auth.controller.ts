import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { Cookies } from 'src/common/decorators/cookie.decorator';
import { SkipJwt } from 'src/common/decorators/skip-jwt.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { LocalGuard } from './passport/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @SkipJwt()
  @UseGuards(LocalGuard)
  @Post('sign-in')
  signIn(
    @User() user: AuthUserDto,
    @Res({ passthrough: true }) response: Response) {
    return this.authService.signIn(user, response);
  }

  @Get('/sign-out')
  signOut(
    @User() user: AuthUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.signOut(user, response);
  }

  @Get('account')
  getAccount(@User() user: AuthUserDto) {
    return user;
  }

  @SkipJwt()
  @Get('/refresh')
  refreshAccount(
    @Cookies('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.refreshAccount(refreshToken, response);
  }
}
