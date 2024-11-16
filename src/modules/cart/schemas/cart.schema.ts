import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { IBaseDocument, IKey } from "src/common/interfaces/index.interface";
import { IPageQuery } from "src/common/interfaces/query.interface";
import { Product } from "src/modules/products/schemas/product.schema";
import { Shop } from "src/modules/shops/schemas/shop.schema";
import { User } from "src/modules/users/schemas/user.schema";

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
    variant: string;
    @Prop()
    quantity: number;
}

export type CartDocument = HydratedDocument<Cart>;
export type CartDoc = CartDocument & IBaseDocument;
export type CartPartial = Partial<Cart>;
export type CartQuery = Pick<Cart, 'client'> & IPageQuery;

@Schema({ timestamps: true })
export class Cart {
    @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
    client: IKey;
    @Prop({ type: [CartItems], default: [] })
    productItems: CartItems[];
    // @Prop({ default: 0 })
    // count: number;
    @Prop({ default: true })
    isActive: boolean;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
