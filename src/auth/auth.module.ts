import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtConfig } from 'src/config/security.config';
import { MailsModule } from 'src/mails/mails.module';
import { UsersModule } from 'src/modules/users/users.module';
import { AuthControllerAdmin } from './auth.controller.admin';
import { AuthControllerClient } from './auth.controller.client';
import { AuthService } from './auth.service';
import { JwtStrategy } from './guard/jwt.strategy';
import { LocalStrategy } from './guard/local.strategy';
import { SignUpSellerTransform } from './transform/signup-seller.transform';
import { KeyStoreModule } from 'src/modules/key-store/key-store.module';
import { KeyStoreService } from 'src/modules/key-store/key-store.service';
import { AuthServiceHelper } from './auth.service.helper';

@Module({
  controllers: [
    AuthControllerAdmin, AuthControllerClient
  ],
  providers: [
    AuthService, AuthServiceHelper,
    LocalStrategy, JwtStrategy,
    SignUpSellerTransform,
    // KeyStoreService
  ],
  imports: [
    UsersModule,
    KeyStoreModule,
    PassportModule,
    MailsModule,
    JwtModule.registerAsync(JwtConfig)
  ],
})
export class AuthModule { }
