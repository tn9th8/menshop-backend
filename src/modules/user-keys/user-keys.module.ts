import { Module } from '@nestjs/common';
import { UserKeysRepository } from './user-keys.repository';
import { UserKey, UserKeySchema } from './schemas/user-keys.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserKeysService } from './user-keys.service';

@Module({
  providers: [UserKeysService, UserKeysRepository],
  imports: [MongooseModule.forFeature([{ name: UserKey.name, schema: UserKeySchema }])],
  exports: [UserKeysService, UserKeysRepository],
})
export class UserKeysModule { }
