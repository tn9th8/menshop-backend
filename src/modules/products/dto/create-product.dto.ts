import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { IKey } from 'src/common/interfaces/index.interface';
import { isArrayMessage, isNumberMessage, isNumberOptions, isObjectMessage, isStringMessage } from 'src/common/utils/validator.util';


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

    @IsOptional()
    @IsString(isStringMessage('link'))
    group: string; //trim
}

export class ProductVariationTierDto {
    @IsOptional()
    @IsString(isStringMessage('name'))
    name: string; //trim

    @IsOptional()
    @IsString({ each: true, ...isStringMessage('options') })
    @IsArray(isArrayMessage('options'))
    options: string[]; //trim

    @IsOptional()
    @IsString({ each: true, ...isStringMessage('images') })
    @IsArray(isArrayMessage('images'))
    images: string[]; //trim
}

export class CreateProductDto {
    @IsString(isStringMessage('name'))
    name: string; //trim, not empty, not exist

    @IsOptional()
    @IsString(isStringMessage('description'))
    description?: string; //trim

    @IsString(isStringMessage('thumb'))
    thumb: string; //trim, not empty

    @IsOptional()
    @ValidateNested(isObjectMessage('asset'))
    @Type(() => ProductAssetDto)
    asset?: ProductAssetDto; //todo: transform

    // @IsOptional()
    // @IsArray(isArrayMessage('variationTiers'))
    // @ValidateNested({ each: true, ...isObjectMessage('item của variationTiers') })
    // @Type(() => ProductVariationTierDto)
    // variationTiers?: ProductVariationTierDto[]; //todo: transform
    @IsOptional()
    @Type(() => ProductVariationTierDto)
    variationFirst?: ProductVariationTierDto; //todo: transform

    @IsOptional()
    @Type(() => ProductVariationTierDto)
    variationSecond?: ProductVariationTierDto; //todo: transform

    @IsOptional()
    @IsArray(isArrayMessage('attributes'))
    @ValidateNested({ each: true, ...isObjectMessage('item của attributes') })
    @Type(() => ProductAttributeDto)
    attributes?: ProductAttributeDto[]; //todo: transform

    @IsNumber(isNumberOptions(), isNumberMessage('stock'))
    stock: number;

    @IsNumber(isNumberOptions(), isNumberMessage('stock'))
    price: number;

    @IsOptional()
    @IsArray(isArrayMessage('categories'))
    categories: IKey[]; //each: object
}

// @IsOptional()
// @IsArray(isArrayMessage('categories'))
// needs: IKey[]; //each: object
