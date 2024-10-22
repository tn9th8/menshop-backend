import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.scheme';
import { MongooseModule } from '@nestjs/mongoose';
import { MembersController } from './members/members.controller';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';

@Module({
  controllers: [UsersController, MembersController],
  providers: [UsersService, UsersRepository],
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  exports: [UsersService, UsersRepository],
})
export class UsersModule { }
