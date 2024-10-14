import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { IBaseDocument } from "src/common/interfaces/base-document.interface";
import { slugNamePlugin } from "src/common/utils/mongo.util";
import { Shop } from "src/modules/shops/schemas/shop.schema";
import { AttributeSchema, IAttribute } from "./custom.schema";

export type ProductDocument = HydratedDocument<Product>;
export type IProduct = ProductDocument & IBaseDocument;

@Schema()
export class Product {
    @Prop({ required: true })
    name: string;

    @Prop()
    slug: string;

    @Prop({ required: true })
    thumb: string;

    @Prop({ type: [String], default: undefined })
    assets: string[];

    @Prop({
        default: 5.0,
        min: [1.0, 'ratingsAverage is not under 1.0'],
        max: [5.0, 'ratingsAverage is not above 5.0'],
        set: (value: number) => Math.round(value * 10) / 10 //4.648 => 46.48 => 46 => 4.6
    })
    ratingStar: number;

    @Prop({ type: [String], default: undefined })
    hashtags: string[];

    @Prop()
    description: string;

    @Prop({ required: true })
    weight: number;

    @Prop({ required: true })
    minListedPrice: number;

    @Prop({ required: true })
    maxListedPrice: number;

    @Prop()
    minDiscountPrice: number;

    @Prop()
    maxDiscountPrice: number;

    @Prop()
    minDiscount: number; //unit: %

    @Prop()
    maxDiscount: number; //unit: %

    @Prop({ required: true })
    type: string; //type of attributes

    @Prop({ required: true, type: [AttributeSchema] })
    attributes: IAttribute[] //mongodb attribute pattern

    //refer
    @Prop({ required: true, type: mongoose.Schema.ObjectId, ref: Shop.name })
    shop: mongoose.Types.ObjectId;

    @Prop({ required: true, type: [String], default: undefined })
    categories: string[];

    @Prop()
    model: string;

    @Prop()
    variations: string;

    @Prop({ required: true })
    reviews: string;

    //no select
    @Prop({ default: false, index: true, select: false })
    isPublished: boolean; //draft or published

    @Prop()
    publishedDate: Date;

    @Prop({ default: 'normal', index: true, select: false })
    status: string; //normal, ban, priority, limit

}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.plugin(slugNamePlugin);
