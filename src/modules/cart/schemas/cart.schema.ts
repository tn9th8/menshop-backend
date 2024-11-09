import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { IBaseDocument, IKey } from "src/common/interfaces/index.interface";
import { IPageQuery } from "src/common/interfaces/query.interface";
import { User } from "src/modules/users/schemas/user.schema";
import { CartItems } from "./cart-attrs.schema";

export type CartDocument = HydratedDocument<Cart>;
export type CartDoc = CartDocument & IBaseDocument;
export type CartPartial = Partial<Cart>;
export type CartQuery = Pick<Cart, 'client' | 'count'> & IPageQuery;

@Schema({ timestamps: true })
export class Cart {
    @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
    client: IKey;
    @Prop({ type: [SchemaTypes.Mixed], required: true, default: [] })
    items: CartItems[];
    @Prop({ default: 0 })
    count: number;
    @Prop({ required: true, default: true })
    isActive: boolean;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
