import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export class InventoryReservation {
    @Prop({ required: true })
    cartId: string;

    @Prop({ required: true })
    stock: string;

    @Prop({ required: true })
    createdAt: string;
}