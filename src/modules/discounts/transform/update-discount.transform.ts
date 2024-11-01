import { Injectable, PipeTransform } from "@nestjs/common";
import { DiscountType } from "src/common/enums/discount.enum";
import { cleanNullishAttrs, isDatePairOrException, isGreaterOrException, isNotEmptyOrException, toEnum, trims } from "src/common/utils/index.util";
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
        //string is not ""
        isNotEmptyOrException(
            [name, code], ['name', 'code']);
        //number is greater than 0
        [discountValue, minPurchaseValue, applyMax, applyMaxPerClient] = isGreaterOrException(
            [discountValue, minPurchaseValue, applyMax, applyMaxPerClient],
            ['value', 'minPurchaseValue', 'applyMax', 'applyMaxPerClient']);
        type = toEnum(type, DiscountType);
        [startDate, endDate] = isDatePairOrException(
            [startDate, endDate], 'startDate hoặc endDate');
        specificProducts = toObjetIds(specificProducts);
        //to clean partials attrs is nullish
        const partials = cleanNullishAttrs({
            name, code, description, type, value: discountValue, startDate, endDate, minPurchaseValue,
            applyMax, applyMaxPerClient, applyTo, specificProducts
        });
        const cleaned: UpdateDiscountDto = { id, ...partials };
        return cleaned;
    }
}