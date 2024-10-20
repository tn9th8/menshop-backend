import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { NeedLevelEnum } from "src/common/enums/need.enum";
import { IKey } from "src/common/interfaces/index.interface";
import { isArrayMessage, isEnumMessage, isStringMessage } from "src/common/utils/pipe.util";

export class CreateNeedDto {
    @IsString(isStringMessage('name'))
    name: string; //unique

    @IsString(isStringMessage('displayName'))
    displayName: string; //unique

    @IsOptional()
    @IsString(isStringMessage('description'))
    description?: string;

    @IsOptional()
    @IsEnum(NeedLevelEnum, isEnumMessage('level', NeedLevelEnum))
    level?: NeedLevelEnum; //default: LV1
    //ref
    @IsOptional()
    @IsArray(isArrayMessage('children'))
    children?: IKey[];

    @IsOptional()
    parent?: IKey;
}
