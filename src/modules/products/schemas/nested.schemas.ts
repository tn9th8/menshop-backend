import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class ProductAttribute {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    value: string;

    @Prop({ required: false })
    link: string;
}

export const ProductAttributeSchema = SchemaFactory.createForClass(ProductAttribute);


/**
 * another approach
 */
// export interface IAttribute {
//     name: string;
//     value: string;
//     link?: string
// }

// export const AttributeSchema = new Schema<IAttribute>({
//     name: { type: String, required: true },
//     value: { type: String, required: true },
//     link: { type: String, required: false }
// });