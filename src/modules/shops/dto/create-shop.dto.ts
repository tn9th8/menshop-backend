import { IsOptional, IsString } from "class-validator";
import { isStringMessage } from "src/common/utils/validator.util";

export class CreateShopDto {
    @IsString(isStringMessage('name'))
    name: string; //trim, not empty, not exist

    @IsOptional()
    @IsString(isStringMessage('description'))
    description?: string; //trim

    @IsString(isStringMessage('name'))
    image: string; //trim, not empty
}
