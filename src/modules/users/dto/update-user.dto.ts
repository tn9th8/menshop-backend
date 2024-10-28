
import { OmitType, PartialType } from '@nestjs/swagger';
import { IKey } from 'src/common/interfaces/index.interface';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends OmitType(PartialType(CreateUserDto), ['email', 'password'] as const) {
    id: IKey;
}
