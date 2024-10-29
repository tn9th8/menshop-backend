import { Injectable, PipeTransform } from "@nestjs/common";
import { DiscountType } from "src/common/enums/discount.enum";
import { cleanNullishAttrs, cleanNullishNestedAttrs, isDatePairOrException, isGreaterOrException, isNotEmptyOrException, toEnum, trims } from "src/common/utils/index.util";
import { toObjetId, toObjetIds } from "src/common/utils/mongo.util";
import { UpdateDiscountDto } from "../dto/update-discount.dto";

@Injectable()
export class UpdateDiscountTransform implements PipeTransform {
    async transform(value: UpdateDiscountDto) {
        let {
            id,
            name, code, description, type, value: discountValue, startDate, endDate, minPurchaseValue,
            applyMax, applyMaxPerClient, applyTo, specificProducts
        } = value;
        id = toObjetId(id);
        [name, code, description] = trims([name, code, description]);
        isNotEmptyOrException( //string is not ""
            [name, code], ['name', 'code']);
        [discountValue, minPurchaseValue, applyMax, applyMaxPerClient] = isGreaterOrException(
            [discountValue, minPurchaseValue, applyMax, applyMaxPerClient], //number is greater than 0
            ['value', 'minPurchaseValue', 'applyMax', 'applyMaxPerClient']);
        type = toEnum(type, DiscountType);
        [startDate, endDate] = isDatePairOrException(
            [startDate, endDate], 'startDate hoặc endDate');
        specificProducts = toObjetIds(specificProducts);
        const partials = cleanNullishAttrs({ //to clean partials attrs is nullish
            name, code, description, type, value: discountValue, startDate, endDate, minPurchaseValue,
            applyMax, applyMaxPerClient, applyTo, specificProducts
        });
        const cleaned: UpdateDiscountDto = { id, ...partials };
        return cleaned;
    }
}