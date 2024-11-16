import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { IBaseDocument, IKey } from "src/common/interfaces/index.interface";
import { IPageQuery } from "src/common/interfaces/query.interface";
import { Shop } from "src/modules/shops/schemas/shop.schema";
import { User } from "src/modules/users/schemas/user.schema";

export type OrderDocument = HydratedDocument<Order>;
export type OrderDoc = OrderDocument & IBaseDocument;
export type OrderPartial = Partial<Order>;
export type OrderQuery = Order & IPageQuery;

@Schema({ timestamps: true })
export class Order {
    @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
    client: IKey;

    @Prop({ type: SchemaTypes.ObjectId, ref: Shop.name, required: true })
    shop: IKey;

    @Prop({ type: Object })
    checkout: Object;
    /*
        checkout: {
            totalPrice,
            shipFee,
            totalDiscount,
            totalCheckout
        }
     */

    @Prop({ type: [Object] })
    productItems: Object[];
    /*
    [
        {
            "cartProductItem":,
            "product": {
                "_id":,
                "name":,
                "thumb":,
                "price":
            },
            "variant":,
            "quantity":
        }
    ],
    */

    //todo trackings, payment
    @Prop()
    payment: string;

    @Prop()
    trackingNumber: string; //#0001020241113

    @Prop()
    phone: string;

    @Prop()
    shipTo: string;
    /*
        street,
        city,
        state,
        country
    */

    @Prop({ default: 'pending' })
    status: string //pending, confirmed, shipped, cancelled, delivered

}
export const OrderSchema = SchemaFactory.createForClass(Order);
