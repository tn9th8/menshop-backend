import { IsArray, IsObject, IsString } from "class-validator";
import { IsObjectId } from "src/common/decorators/is-object-id.decorator";
import { IKey } from "src/common/interfaces/index.interface";
import { isArrayMessage, isObjectIdMessage, isStringMessage } from "src/common/utils/validator.util";

export class ApplyDiscountDto {
    @IsString(isStringMessage('code'))
    code: string;

    @IsObjectId(isObjectIdMessage('shop'))
    shop: IKey;

    @IsArray(isArrayMessage('products'))
    products: {
        id: IKey,
        price: number,
        quantity: number
    }[];
}
