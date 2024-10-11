import { Module } from '@nestjs/common';
import { ShopsModule } from 'src/modules/shops/shops.module';
import { UsersModule } from 'src/modules/users/users.module';
import { DatabasesService } from './databases.service';

@Module({
  providers: [DatabasesService],
  imports: [
    ShopsModule,
    UsersModule,
  ],
})
export class DatabasesModule { }
