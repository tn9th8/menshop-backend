import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { IBaseDocument } from "src/common/interfaces/index.interface";
import { IKey } from "src/common/interfaces/index.interface";
import { Product } from "src/modules/products/schemas/product.schema";
import { Shop } from "src/modules/shops/schemas/shop.schema";
import { User } from "src/modules/users/schemas/user.schema";
import { InventoryReservation } from "./inven-reservation.schema";

export type InventoryDocument = HydratedDocument<Inventory>;
export type IInventory = InventoryDocument & IBaseDocument;

@Schema({ timestamps: true })
export class Inventory {
    @Prop({ type: SchemaTypes.ObjectId, ref: Product.name, required: true })
    product: IKey;

    @Prop({ type: SchemaTypes.ObjectId, ref: Shop.name, required: true })
    shop: IKey;

    @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
    user: IKey;

    @Prop({ default: 'unknown' })
    location?: string;

    @Prop({ required: true })
    stock?: number;

    @Prop({ default: 0 })
    sold?: number;

    @Prop({ type: [SchemaTypes.Mixed], default: [] })
    reservations?: InventoryReservation[];
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
