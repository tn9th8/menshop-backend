import { Types } from "mongoose";

export const isObjectIdMessage = (attribute: string, id: Types.ObjectId) => {
    return `${attribute} nên là một objectId, id: ${id}`;
}

export const notFoundIdMessage = (attribute: string, id: Types.ObjectId) => {
    return `${attribute} không thể tìm thấy, id: ${id}`;
}