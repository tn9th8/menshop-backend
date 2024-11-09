import { Prop, Schema } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";
import { IKey } from "src/common/interfaces/index.interface";
import { Product } from "src/modules/products/schemas/product.schema";
import { Shop } from "src/modules/shops/schemas/shop.schema";

/**
 * define Prop() productItems in cart
 */
@Schema()
export class CartItems {
    @Prop({ type: SchemaTypes.ObjectId, ref: Product.name })
    product: IKey;
    @Prop({ type: SchemaTypes.ObjectId, ref: Shop.name })
    shop: IKey;
    @Prop()
    quantity: number;
}