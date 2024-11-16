import { Injectable, PipeTransform } from "@nestjs/common";
import { isGreaterOrException } from "src/common/utils/index.util";
import { toObjetIds } from "src/common/utils/mongo.util";
import { CartItemDto } from "../dto/cart-item.dto";

@Injectable()
export class CartItemTransform implements PipeTransform {
    async transform(bodyValue: CartItemDto) {
        let { product, shop, quantity, variant } = bodyValue;
        [product, shop] = toObjetIds([product, shop]);
        //number is greater than 0
        isGreaterOrException([quantity], ['quantity']);
        const cleaned: CartItemDto = { product, shop, quantity, variant };
        return cleaned;
    }
}