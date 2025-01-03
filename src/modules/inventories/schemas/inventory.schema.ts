import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { IBaseDocument } from "src/common/interfaces/index.interface";
import { IKey } from "src/common/interfaces/index.interface";
import { Product } from "src/modules/products/schemas/product.schema";
import { Shop } from "src/modules/shops/schemas/shop.schema";
import { User } from "src/modules/users/schemas/user.schema";
import { IPageQuery } from "src/common/interfaces/query.interface";

/**
 * Prop reservations
 */
@Schema()
export class InventoryReservation {
    @Prop({ required: true })
    cartId: string;
    @Prop({ required: true })
    quantity: string;
    @Prop({ required: true })
    createdAt: string;
}

export type InventoryDocument = HydratedDocument<Inventory>;
export type InventoryDoc = InventoryDocument & IBaseDocument;
export type InventoryPartial = Partial<InventoryDoc>;
export type InventoryQuery = Inventory & IPageQuery;

@Schema({ timestamps: true })
export class Inventory {
    @Prop({ type: SchemaTypes.ObjectId, ref: Product.name, required: true })
    product: IKey;
    @Prop({ type: SchemaTypes.ObjectId, ref: Shop.name })
    shop: IKey;
    @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
    seller: IKey;
    @Prop({ required: true })
    stock?: number;
    @Prop({ default: 0 })
    sold?: number;
    @Prop({ type: [Object], default: [] })
    reservations?: InventoryReservation[];
    @Prop({ default: 'unknown' })
    location?: string;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
