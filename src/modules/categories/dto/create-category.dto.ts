import { IsArray, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { CategoryLevelEnum } from "src/common/enums/category.enum";
import { IKey } from "src/common/interfaces/index.interface";
import { isArrayMessage, isEnumMessage, isObjectMessage, isStringMessage } from "src/common/utils/validator.util";

export class CreateCategoryDto {
    @IsString(isStringMessage('name'))
    name: string; //trim, not empty, not exist

    @IsOptional()
    @IsString(isStringMessage('description'))
    description?: string; //trim

    @IsOptional()
    @IsEnum(CategoryLevelEnum, isEnumMessage('level', CategoryLevelEnum))
    level?: CategoryLevelEnum; //default LV1

    //ref
    @IsOptional()
    @IsArray(isArrayMessage('children'))
    children?: IKey[]; //each objId

    @IsOptional()
    parent?: IKey; //objId

    //search
    @IsOptional()
    @IsArray(isArrayMessage('search'))
    @ValidateNested({ each: true, ...isObjectMessage('item của search') })
    search?: string[]; //each: trim, clean empty

    //constraints
    @IsOptional()
    @IsArray(isArrayMessage('attributes'))
    attributes?: string[]; //each: trim, clean empty

    @IsOptional()
    @IsArray(isArrayMessage('specifications'))
    specifications?: string[]; //each: trim, clean empty

}
