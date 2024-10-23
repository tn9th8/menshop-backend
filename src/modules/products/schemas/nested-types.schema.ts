import { Prop, Schema } from "@nestjs/mongoose";

/**
 * define Prop() variation
 */
@Schema()
export class ProductVariation {
    @Prop({ default: false, required: true })
    isUse: boolean;

    @Prop({ default: 'Màu sắc' })
    name: string;

    @Prop({ type: [String] })
    options: string[];

    @Prop({ type: [String] })
    images: string[];
}

/**
 * define Prop() size
 */
@Schema()
export class ProductSize {
    @Prop({ default: false, required: true })
    isUse: boolean;

    @Prop({ default: 'Size' })
    name: string;

    @Prop({ type: [String] })
    options: string[];

    @Prop({ default: null })
    image: string;
}

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
    // @Prop({ default: null })
    // video: string;

    @Prop({ type: [String], default: null })
    productImages: string[];

    @Prop({ type: [String], default: null })
    variationImages: string[];

    @Prop({ default: null })
    sizeImage: string;
}


/**
 * define Prop() Attribute
 */
@Schema()
export class ProductAttribute {
    @Prop({ default: null })
    name: string;

    @Prop({ default: null })
    value: string;

    @Prop({ default: null })
    link: string;
}


/**
 * another approach
 */
// export interface ProductAttribute {
//     name: string;
//     value: string;
//     link?: string
// }

// export const ProductAttributeSchema = new mongoose.Schema<ProductAttribute>({
//     name: { type: String, required: true },
//     value: { type: String, required: true },
//     link: { type: String, required: false }
// });

