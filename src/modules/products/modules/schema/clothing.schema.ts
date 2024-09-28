import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type ClothingDocument = HydratedDocument<Clothing>;

export interface IClothing extends ClothingDocument {
    _id: mongoose.Types.ObjectId;
    isDeleted: false;
    deletedAt: boolean;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

@Schema()
export class Clothing {
    @Prop()
    color: string;

    @Prop()
    size: string;

    @Prop()
    material: string;
}

export const ClothingSchema = SchemaFactory.createForClass(Clothing);