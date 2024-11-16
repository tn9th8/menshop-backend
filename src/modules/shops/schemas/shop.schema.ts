import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { IBaseDocument } from "src/common/interfaces/index.interface";
import { IKey } from "src/common/interfaces/index.interface";
import { IPageQuery } from "src/common/interfaces/query.interface";
import { User } from "src/modules/users/schemas/user.schema";

export type ShopDocument = HydratedDocument<Shop>;
export type ShopDoc = ShopDocument & IBaseDocument;
export type ShopPartial = Partial<ShopDoc>;
export type ShopQuery = Partial<Pick<ShopDoc, '_id' | 'seller'> & IPageQuery>;

@Schema({ timestamps: true })
export class Shop {
    @Prop({ required: true })
    name: string;
    @Prop({ default: null })
    description?: string;
    @Prop({ default: null })
    image?: string;
    @Prop({ default: false })
    isMall?: boolean;
    @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
    seller: IKey;
    @Prop({ default: false })
    isOpen?: boolean;
    @Prop({ default: true })
    isActive?: boolean;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);
ShopSchema.index({ isOpen: 1, isActive: 1 });
