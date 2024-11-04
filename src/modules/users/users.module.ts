import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserKeysModule } from '../user-keys/user-keys.module';
import { User, UserSchema } from './schemas/user.schema';
import { UsersControllerAdmin } from './users.controller.admin';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersControllerAdmin],
  providers: [UsersService, UsersRepository],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UserKeysModule
  ],
  exports: [UsersService, UsersRepository],
})
export class UsersModule { }
