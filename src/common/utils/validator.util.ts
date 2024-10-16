export const isStringMessage = (attribute: string) => {
    return { message: `${attribute} nên là một string không rỗng` };
}

export const isNotEmptyMessage = (attribute: string) => {
    return { message: `${attribute} không là empty/null/undefined` };
}

export const isArrayMessage = (attribute: string) => {
    return { message: `${attribute} nên là một array không rỗng` };
}

export const isObjectMessage = (attribute: string) => {
    return { message: `${attribute} nên là một object` };
}

export const isObjectIdMessage = (attribute: string) => {
    return { message: `${attribute} nên là một objectId` };
}