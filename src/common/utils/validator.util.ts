import { joinEnumValues } from "./index.util";

//MESSAGE//
export const isStringMessage = (attribute: string) => {
    return { message: `${attribute} nên là một string` };
}

export const minStringMessage = (attribute: string) => {
    return { message: `${attribute} nên là một string không rỗng` };
}

export const isNotEmptyMessage = (attribute: string) => {
    return { message: `${attribute} không là empty/null/undefined` };
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

//TRANSFORM//
//END TRANSFORM//
export const trim = ({ value }: { value: string }) => {
    const clean = value?.trim();
    return clean;
}

export const trimArray = ({ value }: { value: string[] }) => {
    const cleanArray = value.map((item) => trim({ value: item }));
    return cleanArray;
}