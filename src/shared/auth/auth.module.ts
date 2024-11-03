import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtConfig } from 'src/config/jwt.config';
import { RolesModule } from 'src/modules/roles/roles.module';
import { UserKeysModule } from 'src/modules/user-keys/user-keys.module';
import { UsersModule } from 'src/modules/users/users.module';
import { MailsModule } from 'src/shared/mails/mails.module';
import { AuthControllerAdmin } from './auth.controller.admin';
import { AuthControllerClient } from './auth.controller.client';
import { AuthService } from './auth.service';
import { AccessJwtStrategy } from './guard/access-jwt.strategy';
import { PasswordStrategy } from './guard/password.strategy';
import { RefreshJwtStrategy } from './guard/refresh-jwt.strategy';
import { AuthHelper } from './helper/auth.helper';

//registerAsync: cấu hình nhiều lần. Sử dụng ở nơi khác thì mấy hình lại => Có thể có cấu hình khác nhau
@Module({
  controllers: [
    AuthControllerAdmin, AuthControllerClient
  ],
  providers: [
    AuthService,
    AuthHelper,
    PasswordStrategy, AccessJwtStrategy, RefreshJwtStrategy
  ],
  imports: [
    UsersModule,
    UserKeysModule,
    RolesModule,
    MailsModule,
    PassportModule,
    JwtModule.registerAsync(JwtConfig),
  ],
})
export class AuthModule { }
