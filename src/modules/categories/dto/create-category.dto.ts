import { IsArray, IsEnum, IsOptional, IsString } from "class-validator";
import { CategoryLevelEnum } from "src/common/enums/category.enum";
import { IKey } from "src/common/interfaces/index.interface";
import { isArrayMessage, isEnumMessage, isStringMessage } from "src/common/utils/pipe.util";

export class CreateCategoryDto {
    @IsString(isStringMessage('name'))
    name: string; //trim, not empty, not exist

    @IsOptional()
    @IsString(isStringMessage('description'))
    description?: string; //trim

    @IsOptional()
    @IsArray(isArrayMessage('attributes'))
    attributes?: string[]; //each: trim, clean empty

    @IsOptional()
    @IsArray(isArrayMessage('specifications'))
    specifications?: string[]; //each: trim, clean empty

    @IsOptional()
    @IsEnum(CategoryLevelEnum, isEnumMessage('level', CategoryLevelEnum))
    level?: CategoryLevelEnum; //default LV1

    //ref
    @IsOptional()
    @IsArray(isArrayMessage('children'))
    children?: IKey[]; //each objId

    @IsOptional()
    parent?: IKey; //objId

}
