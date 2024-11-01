import { PartialType } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsMongoId, IsString } from 'class-validator';
import { IKey } from 'src/common/interfaces/index.interface';
import { isArrayMessage, isBoolMessage, isObjectIdMessage, isStringMessage } from 'src/common/utils/validator.util';

export class CreateRoleDto {
    @IsString(isStringMessage('name')) //note: auto not null, undef, pass ''
    name: string;
    @IsString(isStringMessage('description'))
    description: string;
    @IsString(isStringMessage('group'))
    group: string;
    @IsArray(isArrayMessage('permissions'))
    permissions: IKey[];
    @IsBoolean(isBoolMessage('isActive'))
    isActive: boolean;
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
    @IsMongoId(isObjectIdMessage('roleId')) //note: auto not null, undef
    id: IKey;
}
