import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { AppController } from './app.controller';
import { AppRepository } from './app.repository';
import { AppService } from './app.service';
import { timestampsPlugin } from './common/utils/mongo.util';
import { TransformInterceptor } from './middleware/interceptor/transform.interceptor';
import { CartsModule } from './modules/cart/carts.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { DiscountsModule } from './modules/discounts/discounts.module';
import { InventoriesModule } from './modules/inventories/inventories.module';
import { NeedsModule } from './modules/needs/needs.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { ProductsModule } from './modules/products/products.module';
import { RolesModule } from './modules/roles/roles.module';
import { ShopsModule } from './modules/shops/shops.module';
import { UserKeysModule } from './modules/user-keys/user-keys.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './shared/auth/auth.module';
import { AccessJwtRbacGuard } from './shared/auth/guard/access-jwt-rbac.guard';
import { FilesModule } from './shared/files/files.module';
import { CartDiscountModule } from './modules/cart-discount/cart-discount.module';

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    AppRepository,
    // bind to all routes
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard
    // },
    {
      provide: APP_GUARD,
      useClass: AccessJwtRbacGuard,
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
    // DatabasesModule,
    AuthModule,
    // MailsModule,
    FilesModule,
    // Business Module
    UsersModule,
    UserKeysModule,
    RolesModule,
    PermissionsModule,
    ShopsModule,
    ProductsModule,
    CategoriesModule,
    NeedsModule,
    InventoriesModule,
    DiscountsModule,
    CartsModule,
    OrdersModule,
    CartDiscountModule
  ],
  exports: [AppRepository]
})
export class AppModule { }
