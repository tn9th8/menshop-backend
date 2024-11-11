import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export class InventoryReservation {
    @Prop({ required: true })
    cartId: string;

    @Prop({ required: true })
    quantity: string;

    @Prop({ required: true })
    createdAt: string;
}