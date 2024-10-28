import { PartialType } from '@nestjs/mapped-types';
import { CreateKeyStoreDto } from './create-key-store.dto';

export class UpdateKeyStoreDto extends PartialType(CreateKeyStoreDto) {}
