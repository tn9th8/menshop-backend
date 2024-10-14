import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { ProductAnnotationEnum } from "src/common/enums/product.enum";
import { ProductStatusEnum } from "src/common/enums/status.enum";
import { IBaseDocument } from "src/common/interfaces/base-document.interface";
import { publishPlugin, ratingStarProp, slugPlugin } from "src/common/utils/mongo.util";
import { Brand } from "src/modules/brands/schemas/brand.schema";
import { Category } from "src/modules/categories/schemas/category.schema";
import { Need } from "src/modules/needs/shemas/need.schema";
import { Shop } from "src/modules/shops/schemas/shop.schema";
import { StockModel } from "src/modules/stock-models/schemas/stock-model.schema";
import {
    ProductAsset, ProductAssetSchema,
    ProductAttribute, ProductAttributeSchema,
    ProductSize, ProductSizeSchema,
    ProductVariation, ProductVariationSchema
} from "./nested.schemas";

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

    @Prop(ratingStarProp)
    ratingStar: number;

    @Prop({ type: [String], required: true })
    annotations: ProductAnnotationEnum[];

    @Prop({ type: ProductVariationSchema, required: true })
    variation: ProductVariation;

    @Prop({ type: ProductSizeSchema, required: true })
    size: ProductSize;

    @Prop({ type: [ProductAttributeSchema], required: true })
    attributes: ProductAttribute[] //mongodb attribute pattern

    @Prop({ type: ProductAssetSchema, required: true })
    assets: ProductAsset;

    //refer
    @Prop({ type: SchemaTypes.ObjectId, ref: Shop.name, required: true })
    shop: Types.ObjectId;

    @Prop({ type: SchemaTypes.ObjectId, ref: Brand.name, required: true })
    brand: Types.ObjectId;

    @Prop({ type: [SchemaTypes.ObjectId], ref: StockModel.name, required: true })
    model: Types.ObjectId[];

    @Prop({ type: [SchemaTypes.ObjectId], ref: Category.name, required: true })
    categories: Types.ObjectId[];

    @Prop({ type: [SchemaTypes.ObjectId], ref: Need.name, required: true })
    needs: Types.ObjectId[];

    //no select
    @Prop({ index: true, default: false, select: false })
    isPublished: boolean; //draft or published

    @Prop()
    publishedDate: Date;

    @Prop({ index: true, type: String, default: ProductStatusEnum.NORMAL, select: false })
    status: ProductStatusEnum;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.plugin(slugPlugin);
ProductSchema.plugin(publishPlugin);
