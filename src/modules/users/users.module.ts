import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersControllerClient } from './users.controller.client';
import { UsersControllerAdmin } from './users.controller.admin';
import { UsersRepository } from './users.repository';
import { KeyStoreModule } from '../key-store/key-store.module';
import { UpdateUserTransform } from './transform/update-user.transform';

@Module({
  controllers: [UsersControllerAdmin, UsersControllerClient],
  providers: [UsersService, UsersRepository, UpdateUserTransform],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    KeyStoreModule
  ],
  exports: [UsersService, UsersRepository],
})
export class UsersModule { }
