import { Transform } from "class-transformer";
import { ArrayMinSize, IsBoolean, IsEnum, IsOptional, isString, IsString, MinLength } from "class-validator";
import { Types } from "mongoose";
import { IsObjectId } from "src/common/decorators/is-object-id.decorator";
import { CategoryLevelEnum } from "src/common/enums/category.enum";
import { minArrayMessage, isBoolMessage, isEnumMessage, isObjectIdMessage, minStringMessage, isStringMessage, trim, trimArray } from "src/common/utils/pipe.util";


export class CreateCategoryDto {
    @MinLength(1, minStringMessage('name')) //plus: transform instead of validate
    name: string;

    @MinLength(1, minStringMessage('displayName'))
    displayName: string;

    @IsOptional()
    @IsString(isStringMessage('description'))
    description: string;

    @IsEnum(CategoryLevelEnum, isEnumMessage('level', CategoryLevelEnum))
    level: CategoryLevelEnum;

    @IsOptional()
    @ArrayMinSize(1, minArrayMessage('attributes'))
    @MinLength(1, { each: true, ...minStringMessage('mỗi item trong attributes') })
    attributes: string[];

    @IsOptional()
    @ArrayMinSize(1, minArrayMessage('specifications'))
    @MinLength(1, { each: true, ...minStringMessage('mỗi item trong specifications') })
    specifications: string[];

    //ref
    @IsOptional()
    @ArrayMinSize(1, minArrayMessage('children'))
    @IsObjectId({ each: true, ...isObjectIdMessage('mỗi item trong children') })
    children: Types.ObjectId[];

    @IsOptional()
    @ArrayMinSize(1, minArrayMessage('brands'))
    @IsObjectId({ each: true, ...isObjectIdMessage('mỗi item trong brands') })
    brands: Types.ObjectId[];

    @IsOptional()
    @ArrayMinSize(1, minArrayMessage('variations'))
    @IsObjectId({ each: true, ...isObjectIdMessage('mỗi item trong variations') })
    variations: Types.ObjectId[];

    @IsOptional()
    @ArrayMinSize(1, minArrayMessage('needs'))
    @IsObjectId({ each: true, ...isObjectIdMessage('mỗi item trong needs') })
    needs: Types.ObjectId[];
}
