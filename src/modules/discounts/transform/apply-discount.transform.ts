import { Injectable, PipeTransform } from "@nestjs/common";
import { toNumber, trim } from "src/common/utils/index.util";
import { toObjetId, toObjetIds } from "src/common/utils/mongo.util";
import { ApplyDiscountDto } from "../dto/apply-discount.dto";

@Injectable()
export class ApplyDiscountTransform implements PipeTransform {
    async transform(body: ApplyDiscountDto) {
        let { code, shop, products } = body;
        code = trim(code);
        shop = toObjetId(shop);
        products = products.map(item => {
            const { id, price, quantity } = item;
            return { id: toObjetId(id), price, quantity }
        })
        const cleaned: ApplyDiscountDto = { code, shop, products };
        return cleaned;
    }
}