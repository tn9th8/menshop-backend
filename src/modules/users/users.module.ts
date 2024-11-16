import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserKeysModule } from '../user-keys/user-keys.module';
import { User, UserSchema } from './schemas/user.schema';
import { UsersControllerAdmin } from './users.controller.admin';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { RolesModule } from '../roles/roles.module';
import { ShopsModule } from '../shops/shops.module';
import { UsersFactory } from './services/users.factory';
import { NormalClientsService } from './services/normal-clients.service';
import { NormalSellersService } from './services/normal-sellers.service';
import { NormalAdminsService } from './services/normal-admins.service';
import { VipClientsService } from './services/vip-clients.service';
import { MallSellersService } from './services/mall-sellers.service';
import { CustomEmployeesService } from './services/custom-employees.service';
import { SuperAdminsService } from './services/super-admins.service';
import { UsersControllerSeller } from './users.controller.seller';
import { UsersControllerClient } from './users.controller.client';
import { CartsModule } from '../cart/carts.module';

@Module({
  controllers: [UsersControllerAdmin, UsersControllerSeller, UsersControllerClient],
  providers: [
    UsersService, UsersRepository,
    UsersFactory,
    SuperAdminsService,
    NormalClientsService,
    NormalSellersService,
    NormalAdminsService,
    VipClientsService,
    MallSellersService,
    CustomEmployeesService
  ],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UserKeysModule,
    RolesModule,
    ShopsModule,
    CartsModule
  ],
  exports: [UsersService, UsersRepository, UsersFactory],
})
export class UsersModule { }
