import { IsArray, IsDate, IsDateString, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { DiscountApplyTo, DiscountType } from "src/common/enums/discount.enum";
import { IKey } from "src/common/interfaces/index.interface";
import { isArrayMessage, isDateMessage, isEnumMessage, isIntegerMessage, isIntegerOptions, isNumberMessage, isNumberOptions, isStringMessage } from "src/common/utils/validator.util";

//required attr => is !null
//optional attr => pass null
//partial attr  => pass null

export class CreateDiscountDto {
    @IsString(isStringMessage('name'))
    name: string;

    @IsString(isStringMessage('code'))
    code: string; //trim

    @IsOptional()
    @IsString(isStringMessage('description'))
    description?: string;
    //shop
    //seller
    @IsEnum(DiscountType, isEnumMessage('type', DiscountType))
    type: DiscountType; //toEnum

    @IsNumber(isIntegerOptions(), isIntegerMessage('value'))
    value: number; //check >0

    @IsDateString({}, isDateMessage('startDate'))
    startDate: Date; //check mqh today, end, start //note: nên YYYY-MM-DD, nhưng format khác cũng được

    @IsDateString({}, isDateMessage('endDate'))
    endDate: Date;

    @IsNumber(isIntegerOptions(), isIntegerMessage('minPurchaseValue'))
    minPurchaseValue: number; //check >0

    @IsNumber(isIntegerOptions(), isIntegerMessage('value'))
    applyMax: number; //check >0 //note số lượng tối đa có thể dùng

    @IsNumber(isIntegerOptions(), isIntegerMessage('applyMaxPerUser'))
    applyMaxPerClient: number; //check >0 //note số lượng tối đa có thể dùng trên mỗi user

    @IsOptional()
    @IsEnum(DiscountApplyTo, isEnumMessage('applyTo', DiscountApplyTo))
    applyTo?: DiscountApplyTo; //toEnum //note isEnum chuyen vao transform //note phạm vi áp dụng là tất cả hay chỉ định

    @IsOptional()
    @IsArray(isArrayMessage('productIds'))
    specificProducts?: IKey[]; //toObjectId
}
