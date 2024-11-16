import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { IBaseDocument, IKey } from "src/common/interfaces/index.interface";
import { IPageQuery } from "src/common/interfaces/query.interface";
import { ratingStarProp, slugPlugin } from "src/common/utils/mongo.util";
import { Category } from "src/modules/categories/schemas/category.schema";
import { Shop } from "src/modules/shops/schemas/shop.schema";
import { User } from "src/modules/users/schemas/user.schema";

/**
 * define Prop() variation
 */
@Schema()
export class ProductVariationTier {
    @Prop()
    name?: string;
    @Prop({ type: [String], default: [] })
    options?: string[];
    @Prop({ type: [String], default: [] })
    images?: string[];
}

/**
 * define a nest object ProductAsset for schema
 * @property video: string
 * @property images: string[]
 * @property variations: string[]
 * @property sizeChar: string
 */
@Schema()
export class ProductAsset {
    // @Prop()
    // descriptionVideo?: string;
    @Prop({ type: [String], default: [] })
    productImages?: string[];
    @Prop({ type: [String], default: [] })
    variationImages?: string[];
    @Prop()
    sizeImage?: string;
}

/**
 * define Prop() Attribute
 */
@Schema()
export class ProductAttribute {
    @Prop()
    name?: string;
    @Prop()
    value?: string;
    @Prop()
    link?: string;
    @Prop()
    group?: string;
}

export type ProductHydDocument = HydratedDocument<Product>;
export type ProductDocument = ProductHydDocument & IBaseDocument;
export type ProductPartial = Partial<ProductDocument>;
export type ProductQuery = Product & IPageQuery;

@Schema({ timestamps: true })
export class Product {
    @Prop({ required: true })
    name: string;
    @Prop() //plugin
    slug?: string;
    @Prop()
    description?: string;
    @Prop({ required: true })
    thumb: string;
    @Prop({ type: Object, default: {} })
    asset?: ProductAsset;
    // @Prop({ type: [Object], default: [] })
    // variationTiers?: ProductVariationTier[];
    @Prop({ type: Object, default: null })
    variationFirst?: ProductVariationTier;
    @Prop({ type: Object, default: null })
    variationSecond?: ProductVariationTier;
    @Prop({ type: [Object], default: [] }) //mongodb attribute pattern
    attributes?: ProductAttribute[];
    @Prop({ type: [String], default: [] }) //search on attribute values
    tags?: string[];
    @Prop({ required: true }) //todo: sku, price collections
    price: number;
    @Prop(ratingStarProp) //default 5.0
    ratingStar?: number;
    @Prop({ default: 0 })
    views?: number;
    @Prop({ default: 0 })
    likes?: number;
    @Prop({ type: [SchemaTypes.ObjectId], ref: Category.name })
    categories?: IKey[];
    @Prop({ type: SchemaTypes.ObjectId, ref: Shop.name, required: true })
    shop: IKey;
    @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
    seller: IKey;
    @Prop({ default: false }) //published or draft
    isPublished?: boolean;
    @Prop({ default: true }) //active or disable
    isActive?: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.plugin(slugPlugin);
ProductSchema.index({ isOpen: 1, isActive: 1 });
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });

// @Prop({ default: null })
// maxPrice: number;
// @Prop({ default: null })
// discountPrice: number;
// @Prop({ default: null })
// maxProductPrice: number;
// @Prop({ default: null }) //%
// discount: number;
// @Prop({ default: null })
// maxProduct: number;
// @Prop({ type: [SchemaTypes.ObjectId], ref: Need.name, default: null })
// needs?: IKey[];
