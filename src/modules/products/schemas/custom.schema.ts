import { Schema } from "mongoose";

export interface IAttribute {
    name: string;
    value: string;
    link?: string
}

export const AttributeSchema = new Schema<IAttribute>({
    name: { type: String, required: true },
    value: { type: String, required: true },
    link: { type: String, required: false }
});