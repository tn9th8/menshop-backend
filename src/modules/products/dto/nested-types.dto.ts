import { IsArray, IsOptional, IsString } from "class-validator";
import { isArrayMessage, isStringMessage } from "src/common/utils/pipe.util";

export class ProductAssetDto {
    // @IsOptional()
    // @IsString(isStringMessage('video'))
    // productVideo: string; //trim

    @IsOptional()
    @IsArray(isArrayMessage('productImages'))
    productImages: string[]; //each: trim, remove falsy

    @IsOptional()
    @IsArray(isArrayMessage('variationImages'))
    variationImages: string[]; //each: trim, remove falsy

    @IsOptional()
    @IsString(isStringMessage('sizeImage'))
    sizeImage: string; //trim
}

export class ProductAttributeDto {
    @IsOptional()
    @IsString(isStringMessage('name'))
    name: string; //trim

    @IsOptional()
    @IsString(isStringMessage('value'))
    value: string; //trim

    @IsOptional()
    @IsString(isStringMessage('link'))
    link: string; //trim
}