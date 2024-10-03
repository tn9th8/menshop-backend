import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import mongoose from 'mongoose';
import { IsObjectId } from 'src/common/decorators/is-object-id.decorator';
import { ProductsEnum } from 'src/common/enums/product.enum';
import { Shop } from 'src/modules/shops/schemas/shop.schema';
import { Type } from 'src/modules/types/schemas/type.schema';

export class CreateProductDto {
    _id: mongoose.Types.ObjectId;

    @IsNotEmpty({ message: 'product_name không là empty/null/undefined' })
    @IsString({ message: 'product_name nên là một string' })
    product_name: string;

    @IsNotEmpty({ message: 'product_code không là empty/null/undefined' })
    @IsString({ message: 'product_code nên là một string' })
    product_code: string;

    @IsNotEmpty({ message: 'product_thumb không là empty/null/undefined' })
    @IsString({ message: 'product_thumb nên là một string' })
    product_thumb: string;

    // @IsArray({ message: 'product_assets nên là một array' })
    // @IsString({ each: true, message: 'each product_assets nên là một string' })
    product_assets: string[]; //can null

    // @IsArray({ message: 'product_hashtags nên là một array' })
    // @IsString({ each: true, message: 'each product_hashtags nên là một string' })
    product_hashtags: string[]; //can null

    @IsArray({ message: 'product_variations nên là một array' })
    @IsString({ each: true, message: 'each product_variations nên là một string' })
    product_variations: string[];

    @IsString({ message: 'product_thumb nên là một string' })
    product_description: string; //can null

    @IsNumber({}, { message: 'product_weight nên là một number' })
    product_weight: number;

    @IsNumber({}, { message: 'product_basePrice nên là một number' })
    product_basePrice: number;

    @IsNumber({}, { message: 'product_listedPrice nên là một number' })
    product_listedPrice: number;

    // @IsNumber({}, { message: 'product_salePrice nên là một number' })
    product_salePrice: number; //can null

    // refer
    product_shop: mongoose.Types.ObjectId;

    @IsNotEmpty({ message: 'product_type không là empty/null/undefined' })
    @IsObjectId({ message: 'product_type nên là objectId' })
    product_type: mongoose.Types.ObjectId;

    @IsNotEmpty({ message: 'product_attributes không là empty/null/undefined' })
    product_attributes: mongoose.Mixed;
}
