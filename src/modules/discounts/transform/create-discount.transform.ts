import { Injectable, PipeTransform } from "@nestjs/common";
import { DiscountType } from "src/common/enums/discount.enum";
import { cleanNullishAttrs, isDatePairOrException, isGreaterOrException, isNotEmptyOrException, toEnum, trims } from "src/common/utils/index.util";
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
        //string is not ""
        isNotEmptyOrException(
            [name, code], ['name', 'code']);
        //number is greater than 0
        isGreaterOrException(
            [value, minPurchaseValue, applyMax, applyMaxPerClient],
            ['value', 'minPurchaseValue', 'applyMax', 'applyMaxPerClient']);
        type = toEnum(type, DiscountType);
        [startDate, endDate] = isDatePairOrException(
            [startDate, endDate], 'startDate hoặc endDate');
        specificProducts = toObjetIds(specificProducts);
        //clean partial attrs is nullish
        const partials = cleanNullishAttrs(
            { description, applyTo, specificProducts });
        const cleaned: CreateDiscountDto = {
            name, code, type, value, startDate, endDate, minPurchaseValue,
            applyMax, applyMaxPerClient, ...partials
        };
        return cleaned;
    }
}