export const stringValidator = (attribute: string) => {
    return { message: `${attribute} nên là một string không rỗng` };
}

export const notEmptyValidator = (attribute: string) => {
    return { message: `${attribute} không là empty/null/undefined` };
}

export const arrayValidator = (attribute: string) => {
    return { message: `${attribute} nên là một array không rỗng` };
}

export const nestedValidator = (attribute: string) => {
    return { message: `${attribute} nên là một object` };
}

export const objectIdValidator = (attribute: string) => {
    return { message: `${attribute} nên là một objectId` };
}