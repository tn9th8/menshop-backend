import { Module } from '@nestjs/common';
import { UsersModule } from 'src/modules/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { JwtStrategy } from './passport/jwt.strategy';
import ms from 'ms';
import { Jwt } from 'src/common/enums/jwt.enum';

@Module({
  imports: [
    UsersModule,
    PassportModule,
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
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule { }
