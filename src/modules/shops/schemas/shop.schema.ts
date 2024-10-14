import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Collection, HydratedDocument, SchemaTypes, Types } from "mongoose";
import { ShopTypeEnum } from "src/common/enums/shop.enum";
import { StatusEnum } from "src/common/enums/status.enum";
import { IBaseDocument } from "src/common/interfaces/base-document.interface";
import { Brand } from "src/modules/brands/schemas/brand.schema";

export type ShopDocument = HydratedDocument<Shop>;
export type IShop = ShopDocument & IBaseDocument;

@Schema()
export class Shop {
    //required
    @Prop({ trim: true, required: true })
    name: string;

    @Prop({ trim: true, required: true })
    displayName: string;

    @Prop({ trim: true, required: true })
    description: string;

    @Prop({ trim: true, required: true }) //default []: type is normal
    types: ShopTypeEnum[];

    @Prop({ required: true, default: false })
    isOwnBrand: boolean;

    @Prop({ trim: true, required: true })
    location: string;

    @Prop({ type: String, required: true, default: StatusEnum.DRAFT })
    status: StatusEnum;

    //ref
    @Prop({ type: [SchemaTypes.ObjectId], ref: Brand.name }) //default []
    brand: Types.ObjectId[];

    @Prop({ type: [SchemaTypes.ObjectId], ref: Collection.name }) //default []
    collections: Types.ObjectId[];
}

export const ShopSchema = SchemaFactory.createForClass(Shop);
