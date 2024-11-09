import { IsArray, IsMongoId, IsNumber } from "class-validator";
import { IKey } from "src/common/interfaces/index.interface";
import { isArrayMessage, isIntegerMessage, isIntegerOptions, isNumberMessage, isObjectIdMessage } from "src/common/utils/validator.util";

export class CartItemDto {
    @IsMongoId(isObjectIdMessage('product'))
    product: IKey;
    @IsMongoId(isObjectIdMessage('shop'))
    shop: IKey;
    @IsNumber(isIntegerOptions(), isIntegerMessage('quantity'))
    quantity: number;
}

export class RemoveItemsDto {
    @IsMongoId({ each: true, ...isObjectIdMessage('product') })
    @IsArray(isArrayMessage('products'))
    products: IKey[];
}
