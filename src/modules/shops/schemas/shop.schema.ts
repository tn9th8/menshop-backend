import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { IBaseDocument } from "src/common/interfaces/base-document.interface";

export type ShopDocument = HydratedDocument<Shop>;
export interface IShop extends ShopDocument, IBaseDocument { }

@Schema()
export class Shop {
    @Prop({ required: true })
    shop_name: string;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);
