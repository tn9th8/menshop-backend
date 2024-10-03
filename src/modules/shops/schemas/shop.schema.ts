import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { IBaseDocument } from "src/common/interfaces/base-document.interface";
import { User } from "src/modules/users/schemas/user.scheme";

export type ShopDocument = HydratedDocument<Shop>;
export interface IShop extends ShopDocument, IBaseDocument { }

@Schema()
export class Shop {
    @Prop({ required: true })
    shop_name: string;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name })
    shop_seller: User;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);
