import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import mongoose from 'mongoose';
import { IsObjectId } from 'src/common/decorators/is-object-id.decorator';
import { ProductsEnum } from 'src/common/enums/product.enum';
import { Shop } from 'src/modules/shops/schemas/shop.schema';
import { Type } from 'src/modules/types/schemas/type.schema';

export class CreateProductDto {
    _id: mongoose.Types.ObjectId;

    @IsNotEmpty({ message: 'name không là empty/null/undefined' })
    @IsString({ message: 'name nên là một string' })
    name: string;

    @IsNotEmpty({ message: 'code không là empty/null/undefined' })
    @IsString({ message: 'code nên là một string' })
    code: string;

    @IsNotEmpty({ message: 'thumb không là empty/null/undefined' })
    @IsString({ message: 'thumb nên là một string' })
    thumb: string;

    // @IsArray({ message: 'assets nên là một array' })
    // @IsString({ each: true, message: 'each assets nên là một string' })
    assets: string[]; //can null

    // @IsArray({ message: 'hashtags nên là một array' })
    // @IsString({ each: true, message: 'each hashtags nên là một string' })
    hashtags: string[]; //can null

    @IsArray({ message: 'variations nên là một array' })
    @IsString({ each: true, message: 'each variations nên là một string' })
    variations: string[];

    @IsString({ message: 'thumb nên là một string' })
    description: string; //can null

    @IsNumber({}, { message: 'weight nên là một number' })
    weight: number;

    @IsNumber({}, { message: 'basePrice nên là một number' })
    basePrice: number;

    @IsNumber({}, { message: 'listedPrice nên là một number' })
    listedPrice: number;

    // @IsNumber({}, { message: 'salePrice nên là một number' })
    salePrice: number; //can null

    // refer
    shop: mongoose.Types.ObjectId;

    // @IsNotEmpty({ message: 'type không là empty/null/undefined' })
    // @IsObjectId({ message: 'type nên là objectId' })
    // type: mongoose.Types.ObjectId;
    type: string;

    @IsNotEmpty({ message: 'attributes không là empty/null/undefined' })
    attributes: [{ name: string, value: string }];
}
