import { Module } from '@nestjs/common';
import { DatabasesService } from './databases.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/modules/users/schemas/user.scheme';
import { ShopsModule } from 'src/modules/shops/shops.module';
import { UsersModule } from 'src/modules/users/users.module';
import { TypesModule } from 'src/modules/types/types.module';

@Module({
  providers: [DatabasesService],
  imports: [
    ShopsModule,
    UsersModule,
    TypesModule
  ],
})
export class DatabasesModule { }
