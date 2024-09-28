import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

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
}

export const ClockSchema = SchemaFactory.createForClass(Clock);