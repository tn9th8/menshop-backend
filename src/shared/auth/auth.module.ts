import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtConfig } from 'src/config/security.config';
import { UserKeysModule } from 'src/modules/user-keys/user-keys.module';
import { RolesModule } from 'src/modules/roles/roles.module';
import { UsersModule } from 'src/modules/users/users.module';
import { MailsModule } from 'src/shared/mails/mails.module';
import { AuthControllerAdmin } from './auth.controller.admin';
import { AuthControllerClient } from './auth.controller.client';
import { AuthService } from './auth.service';
import { AuthServiceHelper } from './auth.service.helper';
import { JwtStrategy } from './guard/jwt.strategy';
import { PasswordStrategy } from './guard/password.strategy';
import { SignUpSellerTransform } from './transform/signup-seller.transform';

@Module({
  controllers: [
    AuthControllerAdmin, AuthControllerClient
  ],
  providers: [
    AuthService, AuthServiceHelper,
    PasswordStrategy, JwtStrategy,
    SignUpSellerTransform,
    // UserKeysService
  ],
  imports: [
    UsersModule,
    UserKeysModule,
    RolesModule,
    PassportModule,
    MailsModule,
    JwtModule.registerAsync(JwtConfig)
  ],
})
export class AuthModule { }
