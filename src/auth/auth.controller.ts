import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { Cookies } from 'src/common/decorators/cookie.decorator';
import { SkipJwt } from 'src/common/decorators/skip-jwt.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { LocalGuard } from './passport/local.guard';

@ApiTags('Auth Module for Admins')
@Controller('admin/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @SkipJwt()
  @UseGuards(LocalGuard)
  @Post('signin')
  @ApiMessage('sign in')
  @ApiBody({ type: SignInDto })
  signIn(
    @User() user: AuthUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.signIn(user, response);
  }

  @Get('signout')
  @ApiMessage('Sign out')
  signOut(
    @User() user: AuthUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.signOut(user, response);
  }

  @SkipJwt()
  @Get('refresh')
  @ApiMessage('Refresh account')
  refreshAccount(
    @Cookies('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.refreshAccount(refreshToken, response);
  }

  @Get('account')
  @ApiMessage('Fetch account')
  getAccount(@User() user: AuthUserDto) {
    return user;
  }
}

