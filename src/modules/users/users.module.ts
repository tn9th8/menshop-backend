import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.scheme';
import { MongooseModule } from '@nestjs/mongoose';
import { MembersController } from './members/members.controller';
import { UsersController } from './users.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController, MembersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }
