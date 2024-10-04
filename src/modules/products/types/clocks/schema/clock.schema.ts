import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Shop } from "src/modules/shops/schemas/shop.schema";

export type ClockDocument = HydratedDocument<Clock>;

export interface IClock extends ClockDocument {
    _id: mongoose.Types.ObjectId;
    isDeleted: false;
    deletedAt: boolean;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

@Schema()
export class Clock {
    @Prop()
    material: string;

    @Prop()
    faceDiameter: number;

    @Prop()
    faceThickness: number;

    @Prop()
    strap: string;

    @Prop()
    frame: string;

    //refer
    @Prop({ required: true, type: mongoose.Schema.ObjectId, ref: Shop.name })
    shop: mongoose.Types.ObjectId;
}

export const ClockSchema = SchemaFactory.createForClass(Clock);