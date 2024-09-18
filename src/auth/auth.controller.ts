import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
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
  async signIn(@User() user: AuthUserDto) {
    return this.authService.signIn(user);
  }

  @Get('account')
  getAccount(@User() user: AuthUserDto) {
    return user;
  }
}
