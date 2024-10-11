import { Schema } from "mongoose";

export interface IAttributes {
    name: string;
    value: string;
    link?: string
}

export const AttributesSchema = new Schema<IAttributes>({
    name: { type: String, required: true },
    value: { type: String, required: true },
    link: { type: String, required: false }
});