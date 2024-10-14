import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import mongoose from "mongoose";
import { CategoryLevelEnum, CategoryTypeEnum } from "src/common/enums/category.enum";


export class CreateCategoryDto {
    @IsString({ message: 'name nên là một string' })
    @IsNotEmpty({ message: 'name không nên là empty/null/undefined' })
    name: string;

    @IsString({ message: 'displayName nên là một string' })
    @IsNotEmpty({ message: 'displayName không nên là empty/null/undefined' })
    displayName: string;

    @IsString({ message: 'description nên là một string' })
    @IsNotEmpty({ message: 'description không nên là empty/null/undefined' })
    description: string;

    @IsEnum(CategoryLevelEnum, { message: 'level không hợp lệ' }) //default not empty
    level: CategoryLevelEnum;

    @IsEnum(CategoryTypeEnum, { message: 'type không hợp lệ' }) //default not empty
    type: CategoryTypeEnum;

    // position: number;

    parentCategories?: mongoose.Types.ObjectId[];

    parentCollections?: mongoose.Types.ObjectId[];

    childCategories: mongoose.Types.ObjectId[];

    childCollections: mongoose.Types.ObjectId[];

}
