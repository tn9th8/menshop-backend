import { Injectable, PipeTransform } from "@nestjs/common";
import { toNumber, trim } from "src/common/utils/index.util";
import { toObjetId, toObjetIds } from "src/common/utils/mongo.util";
import { ApplyDiscountDto } from "../dto/apply-discount.dto";

@Injectable()
export class ApplyDiscountTransform implements PipeTransform {
    async transform(body: ApplyDiscountDto) {
        let { code, shop, productItems } = body;
        code = trim(code);
        shop = toObjetId(shop);
        productItems = productItems.map(item => {
            const { _id, price, quantity } = item;
            return { _id: toObjetId(_id), price, quantity }
        })
        const cleaned: ApplyDiscountDto = { code, shop, productItems };
        return cleaned;
    }
}