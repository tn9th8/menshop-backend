import { PartialType } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';
import { IKey } from 'src/common/interfaces/index.interface';
import { isObjectIdMessage, isStringMessage } from 'src/common/utils/validator.util';

export class CreatePermissionDto {
    @IsString(isStringMessage('name')) //note: auto IsNotEmpty (null, undef), pass ''
    name: string;
    @IsString(isStringMessage('slug'))
    slug: string;
    @IsString(isStringMessage('version'))
    version: string;
    @IsString(isStringMessage('group'))
    group: string;
    @IsString(isStringMessage('slug'))
    module: string;
    @IsString(isStringMessage('apiMethod'))
    apiMethod: string;
    @IsString(isStringMessage('apiPath'))
    apiPath: string;
}

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
    @IsMongoId(isObjectIdMessage('permissionId')) //note: auto not null, undef
    id: IKey;
}

