import { Injectable, PipeTransform } from "@nestjs/common";
import { DiscountType } from "src/common/enums/discount.enum";
import { cleanNullishAttrs, cleanNullishNestedAttrs, isDatePairOrException, isGreaterOrException, isNotEmptyOrException, toEnum, trims } from "src/common/utils/index.util";
import { toObjetIds } from "src/common/utils/mongo.util";
import { CreateDiscountDto } from "../dto/create-discount.dto";

@Injectable()
export class CreateDiscountTransform implements PipeTransform {
    async transform(bodyValue: CreateDiscountDto) {
        let {
            name, code, description, type, value, startDate, endDate, minPurchaseValue,
            applyMax, applyMaxPerClient, applyTo, specificProducts
        } = bodyValue;
        [name, code, description] = trims([name, code, description]);
        isNotEmptyOrException( //string is not ""
            [name, code], ['name', 'code']);
        isGreaterOrException( //number is greater than 0
            [value, minPurchaseValue, applyMax, applyMaxPerClient],
            ['value', 'minPurchaseValue', 'applyMax', 'applyMaxPerClient']);
        type = toEnum(type, DiscountType);
        [startDate, endDate] = isDatePairOrException(
            [startDate, endDate], 'startDate hoặc endDate');
        specificProducts = toObjetIds(specificProducts);
        const partials = cleanNullishAttrs(
            { description, applyTo, specificProducts }); //clean partial attrs is nullish
        const cleaned: CreateDiscountDto = {
            name, code, type, value, startDate, endDate, minPurchaseValue,
            applyMax, applyMaxPerClient, ...partials
        };
        return cleaned;
    }
}