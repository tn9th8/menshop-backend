import { PartialType } from '@nestjs/mapped-types';
import { CreateUserKeyDto } from './create-user-keys.dto';

export class UpdateUserKeyDto extends PartialType(CreateUserKeyDto) { }
