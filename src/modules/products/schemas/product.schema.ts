import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { IBaseDocument } from "src/common/interfaces/base-document.interface";
import { ratingStarProp, slugPlugin } from "src/common/utils/mongo.util";
import { Category } from "src/modules/categories/schemas/category.schema";
import { Need } from "src/modules/needs/schemas/need.schema";
import { Shop } from "src/modules/shops/schemas/shop.schema";
import { StockModel } from "src/modules/stock-models/schemas/stock-model.schema";
import { ProductAsset, ProductAttribute, ProductSize, ProductVariation } from "./nested-types.schema";
import { IKey } from "src/common/interfaces/index.interface";

export type ProductDocument = HydratedDocument<Product>;
export type IProduct = ProductDocument & IBaseDocument;

@Schema({ timestamps: true })
export class Product {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true }) //plugin
    slug: string;

    @Prop({ default: null })
    description: string;

    @Prop({ required: true })
    thumb: string;

    @Prop({ type: Object, default: null })
    asset: ProductAsset;

    @Prop({ type: [Object], default: null }) //mongodb attribute pattern
    attributes: ProductAttribute[];

    @Prop({ default: 1000, required: true }) //model
    price: number;

    @Prop({ default: null })
    maxPrice: number;

    @Prop({ default: null })
    discountPrice: number;

    @Prop({ default: null })
    maxDiscountPrice: number;

    @Prop({ default: null }) //%
    discount: number;

    @Prop({ default: null })
    maxDiscount: number;

    @Prop(ratingStarProp) //default 5.0, required: true
    ratingStar: number;

    @Prop({ type: Object, default: null }) //model
    variation: ProductVariation;

    @Prop({ type: Object, default: null }) //model
    size: ProductSize;

    @Prop({ index: true, select: false, default: false, required: true }) //published or draft
    isPublished: boolean;

    @Prop({ index: true, select: false, default: true, required: true }) //active or disable
    isActive: boolean;

    //refer
    @Prop({ type: [SchemaTypes.ObjectId], ref: Category.name, default: null })
    categories: IKey[];

    @Prop({ type: [SchemaTypes.ObjectId], ref: Need.name, default: null })
    needs: IKey[];

    @Prop({ type: SchemaTypes.ObjectId, ref: Shop.name, required: true })
    shop: IKey;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.plugin(slugPlugin);
ProductSchema.index({ displayName: 'text', description: 'text' })