import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { ProductAnnotationEnum } from "src/common/enums/product.enum";
import { ProductStatusEnum } from "src/common/enums/status.enum";
import { IBaseDocument } from "src/common/interfaces/base-document.interface";
import { publishPlugin, ratingStarProp, slugPlugin } from "src/common/utils/mongo.util";
import { Brand } from "src/modules/brands/schemas/brand.schema";
import { Category } from "src/modules/categories/schemas/category.schema";
import { Need } from "src/modules/needs/schemas/need.schema";
import { Shop } from "src/modules/shops/schemas/shop.schema";
import { StockModel } from "src/modules/stock-models/schemas/stock-model.schema";
import {
    ProductAsset,
    ProductAttribute,
    ProductSize,
    ProductVariation,
} from "./nested-types.schema";

mongoose.set('applyPluginsToChildSchemas', false);

export type ProductDocument = HydratedDocument<Product>;
export type IProduct = ProductDocument & IBaseDocument;

@Schema()
export class Product {
    @Prop({ trim: true, required: true }) //code
    name: string;

    @Prop({ trim: true, required: true })
    displayName: string;

    @Prop({ required: true }) //plugin
    slug: string;

    @Prop({ trim: true, default: null })
    description: string;

    @Prop({ default: 0, required: true })
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

    @Prop({ type: [String] }) //default []
    annotations: ProductAnnotationEnum[];

    @Prop({ type: Object, default: null })
    variation: ProductVariation;

    @Prop({ type: Object, default: null })
    size: ProductSize;

    @Prop({ type: Object, required: true })
    asset: ProductAsset; //todo: thumb, file

    @Prop({ type: [Object], required: true }) //mongodb attribute pattern
    attributes: ProductAttribute[];

    //refer
    @Prop({ type: SchemaTypes.ObjectId, ref: Shop.name, required: true })
    shop: Types.ObjectId;

    @Prop({ type: SchemaTypes.ObjectId, ref: Brand.name, default: null })
    brand: Types.ObjectId;

    @Prop({ type: [SchemaTypes.ObjectId], ref: StockModel.name, required: true })
    models: Types.ObjectId[];

    @Prop({ type: [SchemaTypes.ObjectId], ref: Category.name, required: true })
    categories: Types.ObjectId[];

    @Prop({ type: [SchemaTypes.ObjectId], ref: Need.name, default: null })
    needs: Types.ObjectId[];

    //no select
    @Prop({ index: true, select: false, default: false, required: true }) //draft or published
    isPublished: boolean;

    @Prop({ default: null }) //plugin //todo: method instead of plugin
    publishedDate: Date;

    @Prop({ index: true, type: String, default: ProductStatusEnum.NORMAL, select: false, required: true })
    status: ProductStatusEnum;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.plugin(slugPlugin);
ProductSchema.plugin(publishPlugin);
ProductSchema.index({ displayName: 'text', description: 'text' })