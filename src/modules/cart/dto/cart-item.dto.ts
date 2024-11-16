import { PartialType } from "@nestjs/swagger";
import { IsArray, IsMongoId, IsNumber, IsOptional, IsString } from "class-validator";
import { IKey } from "src/common/interfaces/index.interface";
import { isArrayMessage, isIntegerMessage, isIntegerOptions, isNumberMessage, isObjectIdMessage, isStringMessage } from "src/common/utils/validator.util";

export class CartItemDto {
    @IsMongoId(isObjectIdMessage('product'))
    product: IKey;
    @IsMongoId(isObjectIdMessage('shop'))
    shop: IKey;
    @IsNumber(isIntegerOptions(), isIntegerMessage('quantity'))
    quantity: number;
    @IsString(isStringMessage('variant'))
    variant: string;

}

export class UpdateCartItemDto {
    @IsMongoId(isObjectIdMessage('_id'))
    _id: IKey;
    @IsNumber(isIntegerOptions(), isIntegerMessage('quantity'))
    quantity: number;
    // @IsOptional()
    // @IsNumber(isIntegerOptions(), isIntegerMessage('change'))
    // increase: number; //là lượng thay đổi, dương nếu tăng, âm nếu giảm
}

export class RemoveItemsDto {
    @IsMongoId({ each: true, ...isObjectIdMessage('product') })
    @IsArray(isArrayMessage('products'))
    productItems: IKey[];
}
