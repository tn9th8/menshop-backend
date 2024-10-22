import { IKey } from "../interfaces/index.interface";

export const isObjectIdMessage = (attribute: string, id: IKey | string) => {
    return `${attribute} nên là một objectId, id: ${id}`;
}

export const notFoundIdMessage = (attribute: string, id: IKey) => {
    return `${attribute} không thể tìm thấy, id: ${id}`;
}

export const notEmptyMessage = (attribute: string) => {
    return `${attribute} không nên rỗng`;
}

export const isExistMessage = (attribute: string) => {
    return `${attribute} đã tồn tại`;
}