import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { LocalGuard } from './passport/local.guard';
import { SkipJwt } from 'src/common/decorators/skip-jwt.decorator';
import { AuthUserDto } from './dto/auth-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @SkipJwt()
  @UseGuards(LocalGuard)
  @Post('sign-in')
  async signIn(@Request() req: any) {
    return this.authService.signIn(req.user);
  }

  @Get('account')
  getAccount(@Request() req: any) {
    const user: AuthUserDto = req.user;
    return user;
  }
}
