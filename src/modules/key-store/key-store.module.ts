import { Module } from '@nestjs/common';
import { KeyStoreRepository } from './key-store.repository';
import { KeyStore, KeyStoreSchema } from './schemas/key-store.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { KeyStoreService } from './key-store.service';

@Module({
  providers: [KeyStoreService, KeyStoreRepository],
  imports: [MongooseModule.forFeature([{ name: KeyStore.name, schema: KeyStoreSchema }])],
  exports: [KeyStoreService, KeyStoreRepository],
})
export class KeyStoreModule { }
