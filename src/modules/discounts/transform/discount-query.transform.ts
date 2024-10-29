import { Injectable, PipeTransform } from "@nestjs/common";
import { cleanNullishAttrs, toPageQuery, trims } from "src/common/utils/index.util";
import { DiscountQuery } from "../schemas/discount.schema";
import { toObjetId } from "src/common/utils/mongo.util";

@Injectable()
export class DiscountQueryTransform implements PipeTransform {
    async transform(value: DiscountQuery) {
        //should not use ... => because we need exclude strange attr
        let { page, limit, sort, name, code, shop } = value;
        [name, code] = trims([name, code]);
        shop = toObjetId(shop);
        const pageQuery = toPageQuery({ page, limit, sort });
        const cleaned: DiscountQuery = cleanNullishAttrs(
            { ...pageQuery, name, code, shop });
        return cleaned;
    }
}