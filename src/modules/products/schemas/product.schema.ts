import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type ProductDocument = HydratedDocument<Product>;

export interface IProduct extends ProductDocument {
    _id: mongoose.Types.ObjectId;
    isDeleted: false;
    deletedAt: boolean;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

@Schema()
export class Product {
    @Prop({ required: true })
    name: string;

    //  @Prop({ unique: true })
    @Prop()
    code: string;

    @Prop()
    thumb: string;

    @Prop([String])
    assets: string[];

    @Prop([String])
    hashtags: string[];

    @Prop()
    description: string;

    @Prop()
    weight: number;

    @Prop()
    releaseDate: Date;

    @Prop()
    basePrice: number;

    @Prop()
    listedPrice: number;

    @Prop()
    salePrice: number;

    @Prop({ enum: ['isActive, isDraft'] })
    status: string;

    @Prop()
    attributes: mongoose.Mixed; // ===mongoose.Schema.Types.Mixed

    // refer
    @Prop()
    type: string;
    // category: string;

    @Prop()
    brand: string;

    @Prop()
    reviews: string;

}

export const ProductSchema = SchemaFactory.createForClass(Product);
