import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { AppController } from './app.controller';
import { AppRepository } from './app.repository';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtGuard } from './auth/guard/jwt.guard';
import { timestampsPlugin } from './common/utils/mongo.util';
import { TransformInterceptor } from './core/interceptor/transform.interceptor';
import { DatabasesModule } from './databases/databases.module';
import { FilesModule } from './files/files.module';
import { MailsModule } from './mails/mails.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { DiscountsModule } from './modules/discounts/discounts.module';
import { InventoriesModule } from './modules/inventories/inventories.module';
import { KeyStoreModule } from './modules/key-store/key-store.module';
import { NeedsModule } from './modules/needs/needs.module';
import { ProductsModule } from './modules/products/products.module';
import { ShopsModule } from './modules/shops/shops.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    AppRepository,
    // bind to all endpoints
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
  imports: [
    // Config Module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    // Mongoose Module
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => (
        {
          uri: configService.get<string>('MONGODB_URI'),
          connectionFactory: (connection) => {
            connection.plugin(softDeletePlugin);
            connection.plugin(timestampsPlugin);
            return connection;
          },
        }
      ),
    }),
    // Throttler Module
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => [
        {
          ttl: configService.get<number>('THROTTLE_TTL'),
          limit: configService.get<number>('THROTTLE_LIMIT'),
        }
      ],
    }),
    // Technique Module
    DatabasesModule,
    AuthModule,
    MailsModule,
    FilesModule,
    // Business Module
    UsersModule,
    KeyStoreModule,
    ShopsModule,
    CategoriesModule,
    NeedsModule,
    ProductsModule,
    InventoriesModule,
    DiscountsModule,
  ],
  exports: [AppRepository]
})
export class AppModule { }
