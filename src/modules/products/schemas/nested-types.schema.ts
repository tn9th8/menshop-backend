import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

/**
 * define a nest object ProductAsset for schema
 * @property thumb: string,required
 * @property video: string
 * @property images: string[]
 * @property variationImages: string[]
 * @property sizeChartImage: string
 */
@Schema()
export class ProductAsset {
    @Prop({ required: true, default: true })
    thumb: string;

    @Prop({ default: null })
    video: string;

    @Prop({ type: [String] }) //default []
    images: string[];

    @Prop({ type: [String] })
    variationImages: string[];

    @Prop({ default: null })
    sizeChartImage: string;
}

export const ProductAssetSchema = SchemaFactory.createForClass(ProductAsset);

/**
 * define Prop() variation
 */
@Schema()
export class ProductVariation {
    @Prop({ required: true, default: true })
    isColor: string;

    @Prop({ required: true, default: 'Màu sắc' })
    name: string;

    @Prop({ type: [String], required: true })
    options: string[];

    @Prop({ type: [String], required: true })
    images: string[];
}

export const ProductVariationSchema = SchemaFactory.createForClass(ProductVariation);

/**
 * define Prop() size
 */
@Schema()
export class ProductSize {
    @Prop({ required: true, default: false })
    isCustom: string;

    @Prop({ required: true, default: 'Size' })
    name: string;

    @Prop({ type: [String], required: true })
    options: string[];

    @Prop({ required: true })
    chartImage: string;
}

export const ProductSizeSchema = SchemaFactory.createForClass(ProductSize);

/**
 * define Prop() Attribute
 */
// @Schema()
// export class ProductAttribute {
//     @Prop({ required: true })
//     name: string;

//     @Prop({ required: true })
//     value: string;

//     @Prop({ required: false })
//     link: string;
// }

// export const ProductAttributeSchema = SchemaFactory.createForClass(ProductAttribute);

/**
 * another approach
 */
export interface ProductAttribute {
    name: string;
    value: string;
    link?: string
}

export const ProductAttributeSchema = new mongoose.Schema<ProductAttribute>({
    name: { type: String, required: true },
    value: { type: String, required: true },
    link: { type: String, required: false }
});

