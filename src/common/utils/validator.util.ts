export const stringMessage = (attribute: string) => {
    return { message: `${attribute} nên là một string không rỗng` };
}

export const notEmptyMessage = (attribute: string) => {
    return { message: `${attribute} không là empty/null/undefined` };
}

export const arrayMessage = (attribute: string) => {
    return { message: `${attribute} nên là một array không rỗng` };
}

export const nestedMessage = (attribute: string) => {
    return { message: `${attribute} nên là một object` };
}

export const objectIdMessage = (attribute: string) => {
    return { message: `${attribute} nên là một objectId` };
}