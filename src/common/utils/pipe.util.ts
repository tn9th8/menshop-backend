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
export const trim = (value: string) => {
    if (!value) {
        return null;
    }
    const clean = value.trim();
    return clean;
}

// [un, un]
export const trimArray = (values: string[]) => {
    if (!values) {
        return null;
    }
    const cleanArray = values.map((value) => {
        const clean = trim(value);
        if (clean) { return clean; }
    });
    if (cleanArray.length) { return cleanArray; }

}
//END TRANSFORM//