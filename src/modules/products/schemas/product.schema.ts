import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { IBaseDocument } from "src/common/interfaces/base-document.interface";
import { slugPlugin } from "src/common/utils/mongo.util";
import { Shop } from "src/modules/shops/schemas/shop.schema";
import { Type } from "src/modules/types/schemas/type.schema";

export type ProductDocument = HydratedDocument<Product>;
export interface IProduct extends ProductDocument, IBaseDocument { }

@Schema()
export class Product {
    @Prop({ required: true })
    name: string;

    @Prop()
    slug: string;

    @Prop({ required: true })
    code: string;

    @Prop({ required: true })
    thumb: string;

    @Prop({ type: [String], default: undefined })
    assets: string[];

    @Prop({ type: [String], default: undefined })
    hashtags: string[];

    @Prop({ type: [String], default: undefined })
    variations: string[];

    @Prop({
        default: 5.0,
        min: [1.0, 'ratingsAverage is not under 1.0'],
        max: [5.0, 'ratingsAverage is not above 5.0'],
        set: (value: number) => Math.round(value * 10) / 10
    })
    ratingsAverage: number;

    @Prop()
    description: string;

    @Prop({ required: true })
    weight: number;

    @Prop({ required: true })
    basePrice: number;

    @Prop({ required: true })
    listedPrice: number;

    @Prop()
    salePrice: number;

    //refer
    @Prop({ required: true, type: mongoose.Schema.ObjectId, ref: Shop.name })
    shop: mongoose.Types.ObjectId;

    @Prop({ required: true, type: mongoose.Schema.ObjectId, ref: Type.name })
    type: mongoose.Types.ObjectId;

    @Prop({ required: true })
    attributes: mongoose.Mixed; //=mongoose.Schema.Types.Mixed

    //no select
    @Prop({ default: true, index: true, select: false })
    isDraft: boolean;

    @Prop({ default: false, index: true, select: false })
    isPublished: boolean;

    @Prop()
    publishedDate: Date;

}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.plugin(slugPlugin);
