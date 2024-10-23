import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { IBaseDocument } from "src/common/interfaces/base-document.interface";
import { IKey } from "src/common/interfaces/index.interface";
import { User } from "src/modules/users/schemas/user.scheme";

export type ShopDocument = HydratedDocument<Shop>;
export type IShop = ShopDocument & IBaseDocument;

@Schema({ timestamps: true })
export class Shop {
    @Prop({ required: true })
    name: string;

    @Prop({ default: null })
    description: string;

    @Prop({ required: true })
    image: string;

    @Prop({ default: false, required: true })
    isMall: boolean;

    @Prop({ index: true, select: false, default: true, required: true })
    isActive: boolean;

    //ref
    @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
    user: IKey;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);
