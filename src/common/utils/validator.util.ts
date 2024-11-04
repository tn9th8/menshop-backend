import { joinEnumValues } from "./index.util";

//OPTIONS//
export const isNumberOptions = () => {
    return { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 4 };
}

export const isIntegerOptions = () => {
    return { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 };
}

//TRANSFORM//
export const trim = (value: string): string | "" | null => {
    //check !falsy, because null.trim() => bug
    if (!value) { return null }
    const clean = value.trim();
    return clean;
}

//MESSAGE//
export const isDateMessage = (attribute: string) => {
    return { message: `${attribute} nên là một date YYYY-MM-DD` };
}

export const isNumberMessage = (attribute: string) => {
    return { message: `${attribute} nên là một number (tối đa 4 chữ số thập phân)` };
}

export const isIntegerMessage = (attribute: string) => {
    return { message: `${attribute} nên là một integer` };
}

export const isStringMessage = (attribute: string) => {
    return { message: `${attribute} nên là một string` };
}

export const minStringMessage = (attribute: string) => {
    return { message: `${attribute} nên là một string không rỗng` };
}

export const isNotEmptyMessage = (attribute: string) => {
    return { message: `${attribute} không nên để trống` };
}

export const isArrayMessage = (attribute: string) => {
    return { message: `${attribute} nên là một array` };
}

export const minArrayMessage = (attribute: string) => {
    return { message: `${attribute} nên là một array không rỗng` };
}

export const isObjectMessage = (attribute: string) => {
    return { message: `${attribute} nên là một object` };
}

export const isObjectIdMessage = (attribute: string) => {
    return { message: `${attribute} nên là một objectId` };
}

export const isEnumMessage = <T>(attribute: string, enumType: T) => {
    const values = joinEnumValues(enumType);
    return { message: `${attribute} nên là ${values}` };
}

export const isBoolMessage = (attribute: string) => {
    return { message: `${attribute} nên là true hoặc false` };
}
//END MESSAGE//