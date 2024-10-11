import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import mongoose from "mongoose";
import { CategoryTypeEnum } from "src/common/enums/category-type.enum";

export class CreateCategoryDto {
    _id: mongoose.Types.ObjectId;

    @IsString({ message: 'name nên là một string' })
    @IsNotEmpty({ message: 'name không nên là empty/null/undefined' })
    name: string;

    @IsString({ message: 'displayName nên là một string' })
    @IsNotEmpty({ message: 'displayName không nên là empty/null/undefined' })
    displayName: string;

    @IsString({ message: 'description nên là một string' })
    @IsNotEmpty({ message: 'description không nên là empty/null/undefined' })
    description: string;

    @IsEnum(CategoryTypeEnum, { message: "type không hợp lệ" }) //default not empty
    type: CategoryTypeEnum;

    parent: mongoose.Types.ObjectId;
}
