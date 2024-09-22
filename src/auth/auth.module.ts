import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import ms from 'ms';
import { Jwt } from 'src/common/enums/jwt.enum';
import { MailModule } from 'src/mail/mail.module';
import { UsersModule } from 'src/modules/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './passport/jwt.strategy';
import { LocalStrategy } from './passport/local.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => (
        {
          secret: configService.get<string>(Jwt.ACCESS_TOKEN_SECRET),
          signOptions: { expiresIn: ms(configService.get<string>(Jwt.ACCESS_TOKEN_EXPIRES)) / 1000 }, //seconds
        }
      ),
    }),
    UsersModule,
    PassportModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule { }
