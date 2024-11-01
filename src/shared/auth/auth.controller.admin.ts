import { Body, Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ApiMessage } from 'src/common/decorators/api-message.decorator';
import { Cookies } from 'src/common/decorators/cookie.decorator';
import { SkipJwt } from 'src/common/decorators/skip-jwt.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { PasswordGuard } from './guard/password.guard';
import { SignUpSellerDto } from './dto/signup-seller.dto';

@ApiTags('Auth Module for Admins')
@Controller('admin/auth')
export class AuthControllerAdmin {
  constructor(private readonly authService: AuthService) { }

  @ApiMessage('sign up')
  @SkipJwt()
  @Post('signup')
  signUp(
    @Body() signUpSellerDto: SignUpSellerDto
  ) {
    return this.authService.signUpSeller(signUpSellerDto);
  }

  @ApiMessage('verify the email')
  @SkipJwt()
  @Get('verify-email')
  verifyEmail(@Query('token') verifyToken: string) {
    const isVerified = this.authService.verifyEmail(verifyToken);
    return isVerified;
  }

  @SkipJwt()
  @ApiMessage('sign in')
  @Post('signin')
  @UseGuards(PasswordGuard)
  @ApiBody({ type: SignInDto })
  signIn(
    @User() user: AuthUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.signIn(user, response);
  }

  @Get('signout')
  @ApiMessage('sign out')
  signOut(
    @User() user: AuthUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.signOut(user, response);
  }

  @SkipJwt()
  @Get('refresh')
  @ApiMessage('refresh an account')
  refreshAccount(
    @Cookies('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.refreshAccount(refreshToken, response);
  }

  @Get('account')
  @ApiMessage('find an account')
  getAccount(
    @User() user: AuthUserDto
  ) {
    return user;
  }
}

