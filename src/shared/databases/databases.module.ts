import { Module } from '@nestjs/common';
import { ShopsModule } from 'src/modules/shops/shops.module';
import { UsersModule } from 'src/modules/users/users.module';
import { DatabasesService } from './databases.service';
import { RolesModule } from 'src/modules/roles/roles.module';
import { UserKeysModule } from 'src/modules/user-keys/user-keys.module';

@Module({
  providers: [DatabasesService],
  imports: [
    ShopsModule,
    RolesModule,
    UsersModule,
    UserKeysModule,
  ],
})
export class DatabasesModule { }
