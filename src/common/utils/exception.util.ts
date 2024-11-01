import { IKey } from "../interfaces/index.interface";

export const createErrorMessage = (object: string) => {
    return `có lỗi khi tạo một ${object}`;
}

export const isObjectIdMessage = (attribute: string, id: IKey | string) => {
    return `${attribute} nên là một objectId, id: ${id}`;
}

export const notFoundIdMessage = (attribute: string, id: IKey) => {
    return `${attribute} không tìm thấy, id: ${id}`;
}

export const notFoundMessage = (attribute: string) => {
    return `${attribute} không tìm thấy`;
}


export const notEmptyMessage = (attribute: string) => {
    return `${attribute} không nên rỗng`;
}

export const isExistMessage = (attribute: string) => {
    return `${attribute} đã tồn tại`;
}

export const isTruthyMessage = (item: string) => {
    return `${item} nên khác null, undefined, 0, "", false, NaN`;
}

export const isRequiredMessage = (item: string) => {
    return `${item} là bắt buộc`;
}

export const isGreaterMessage = (item: string, oppositeItem = 0) => {
    return `${item} nên lớn hơn ${oppositeItem}`;
}