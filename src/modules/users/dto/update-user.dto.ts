
import { OmitType, PartialType } from '@nestjs/swagger';
import { IKey } from 'src/common/interfaces/index.interface';
import { CreateUserDto } from './create-user.dto';
import { IsMongoId } from 'class-validator';
import { isObjectIdMessage } from 'src/common/utils/validator.util';

export class UpdateUserDto extends OmitType(PartialType(CreateUserDto), ['email'] as const) {
    @IsMongoId(isObjectIdMessage('id'))
    id: IKey;
}
