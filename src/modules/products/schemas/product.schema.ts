import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { IBaseDocument } from "src/common/interfaces/base-document.interface";
import { slugNamePlugin } from "src/common/utils/mongo.util";
import { Shop } from "src/modules/shops/schemas/shop.schema";
import { ProductAttribute, ProductAttributeSchema } from "./nested.schemas";
import { ProductAnnotationEnum } from "src/common/enums/product.enum";

export type ProductDocument = HydratedDocument<Product>;
export type IProduct = ProductDocument & IBaseDocument;

@Schema()
export class Product {
    //required
    @Prop({ trim: true, required: true })
    name: string; //id code

    @Prop({ trim: true, required: true })
    displayName: string;

    @Prop()
    slug: string; //plugin

    @Prop({ trim: true, required: true })
    description: string;

    @Prop({
        default: 5.0,
        min: [1.0, 'ratingsAverage is not under 1.0'],
        max: [5.0, 'ratingsAverage is not above 5.0'],
        set: (value: number) => Math.round(value * 10) / 10 //4.648 => 46.48 => 46 => 4.6
    })
    ratingStar: number;

    @Prop({ type: [String], required: true })
    annotations: ProductAnnotationEnum[];

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    maxPrice: number;

    @Prop()
    discountPrice: number;

    @Prop()
    maxDiscountPrice: number;

    @Prop()
    discount: number; //unit: %

    @Prop()
    maxDiscount: number; //unit: %

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



    @Prop({ required: true })
    thumb: string;

    @Prop({ type: [String], default: undefined })
    assets: string[];



    @Prop({ type: [String], default: undefined })
    hashtags: string[];






    @Prop({ required: true, type: [ProductAttributeSchema] })
    attributes: ProductAttribute[] //mongodb attribute pattern



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
