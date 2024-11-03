import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { IBaseDocument } from "src/common/interfaces/index.interface";
import { IKey } from "src/common/interfaces/index.interface";
import { ratingStarProp, slugPlugin } from "src/common/utils/mongo.util";
import { Category } from "src/modules/categories/schemas/category.schema";
import { Need } from "src/modules/needs/schemas/need.schema";
import { Shop } from "src/modules/shops/schemas/shop.schema";
import { User } from "src/modules/users/schemas/user.schema";
import { ProductAsset, ProductAttribute, ProductSize, ProductVariation } from "./nested-types.schema";

export type ProductDocument = HydratedDocument<Product>;
export type IProduct = ProductDocument & IBaseDocument;

@Schema({ timestamps: true })
export class Product {
    @Prop({ required: true })
    name?: string;
    @Prop() //plugin
    slug?: string;
    @Prop({ default: null })
    description?: string;
    @Prop({ required: true })
    thumb?: string;
    @Prop({ type: Object, default: null })
    asset?: ProductAsset;
    @Prop({ type: [Object], default: null }) //mongodb attribute pattern
    attributes?: ProductAttribute[];
    @Prop({ default: 1000, required: true }) //model
    price?: number;
    @Prop(ratingStarProp) //default 5.0, required: true
    ratingStar?: number;
    @Prop({ type: Object, default: null }) //model
    variation?: ProductVariation;
    @Prop({ type: Object, default: null }) //model
    size?: ProductSize;
    @Prop({ type: [SchemaTypes.ObjectId], ref: Category.name, default: null })
    categories?: IKey[];
    @Prop({ type: SchemaTypes.ObjectId, ref: Shop.name, required: true })
    shop?: IKey;
    @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
    seller?: IKey;
    @Prop({ index: true, default: false, required: true }) //published or draft
    isPublished?: boolean;
    @Prop({ index: true, default: true, required: true }) //active or disable
    isActive?: boolean;
    // @Prop({ default: null })
    // maxPrice: number;
    // @Prop({ default: null })
    // discountPrice: number;
    // @Prop({ default: null })
    // maxDiscountPrice: number;
    // @Prop({ default: null }) //%
    // discount: number;
    // @Prop({ default: null })
    // maxDiscount: number;
    // @Prop({ type: [SchemaTypes.ObjectId], ref: Need.name, default: null })
    // needs?: IKey[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.plugin(slugPlugin);
ProductSchema.index({ name: 'text', description: 'text' });