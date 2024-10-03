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
    product_name: string;

    @Prop()
    product_slug: string;

    @Prop({ required: true })
    product_code: string;

    @Prop({ required: true })
    product_thumb: string;

    @Prop({ type: [String], default: undefined })
    product_assets: string[];

    @Prop({ type: [String], default: undefined })
    product_hashtags: string[];

    @Prop({ type: [String], default: undefined })
    product_variations: string[];

    @Prop({
        default: 5.0,
        min: [1.0, 'ratingsAverage is not under 1.0'],
        max: [5.0, 'ratingsAverage is not above 5.0'],
        set: (value: number) => Math.round(value * 10) / 10
    })
    product_ratingsAverage: number;

    @Prop()
    product_description: string;

    @Prop({ required: true })
    product_weight: number;

    @Prop({ required: true })
    product_basePrice: number;

    @Prop({ required: true })
    product_listedPrice: number;

    @Prop()
    product_salePrice: number;

    //refer
    @Prop({ required: true, type: mongoose.Schema.ObjectId, ref: Shop.name })
    product_shop: mongoose.Types.ObjectId;

    @Prop({ required: true, type: mongoose.Schema.ObjectId, ref: Type.name })
    product_type: mongoose.Types.ObjectId;

    @Prop({ required: true })
    product_attributes: mongoose.Mixed; //=mongoose.Schema.Types.Mixed

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
