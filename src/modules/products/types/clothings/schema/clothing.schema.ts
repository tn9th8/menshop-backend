import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { IBaseDocument } from "src/common/interfaces/base-document.interface";
import { Shop } from "src/modules/shops/schemas/shop.schema";

export type ClothingDocument = HydratedDocument<Clothing>;

export interface IClothing extends ClothingDocument, IBaseDocument { }

@Schema()
export class Clothing {
    @Prop()
    color: string;

    @Prop()
    size: string;

    @Prop()
    material: string;

    //refer
    @Prop({ required: true, type: mongoose.Schema.ObjectId, ref: Shop.name })
    shop: mongoose.Types.ObjectId;
}

export const ClothingSchema = SchemaFactory.createForClass(Clothing);