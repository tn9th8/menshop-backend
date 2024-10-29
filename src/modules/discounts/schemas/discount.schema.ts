import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { DiscountApplyTo, DiscountType } from "src/common/enums/discount.enum";
import { IBaseDocument } from "src/common/interfaces/index.interface";
import { IKey } from "src/common/interfaces/index.interface";
import { IPageQuery } from "src/common/interfaces/query.interface";
import { Product } from "src/modules/products/schemas/product.schema";
import { Shop } from "src/modules/shops/schemas/shop.schema";
import { User } from "src/modules/users/schemas/user.schema";

export type DiscountDocument = HydratedDocument<Discount>;
export type DiscountDoc = DiscountDocument & IBaseDocument;
export type DiscountPartial = Partial<Discount>;
export type DiscountQuery = Pick<Discount, 'name' | 'code' | 'shop'> & IPageQuery;

@Schema({ timestamps: true })
export class Discount {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    code: string;

    @Prop({ default: 'unknown' })
    description?: string;

    @Prop({ type: SchemaTypes.ObjectId, ref: Shop.name, required: true })
    shop: IKey;

    @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
    seller: IKey;

    @Prop({ type: String, enum: DiscountType, required: true })
    type: DiscountType; //giảm giá theo vnd hay % //vì đi chung với value nên ko thể default

    @Prop({ required: true })
    value: number; //vnd, %

    @Prop({ type: Date, required: true })
    startDate: Date;

    @Prop({ type: Date, required: true })
    endDate: Date;

    @Prop({ required: true })
    minPurchaseValue: number;

    @Prop({ required: true })
    applyMax: number; //số lượng có thể dùng

    @Prop({ required: true })
    applyMaxPerClient: number; //số lượng tối đa có thể dùng trên mỗi user

    @Prop({ type: String, enum: DiscountApplyTo, default: DiscountApplyTo.ALL })
    applyTo?: DiscountApplyTo; //phạm vi áp dụng là tất cả hay chỉ định sản phẩm

    @Prop({ type: [SchemaTypes.ObjectId], ref: Product.name, default: [] })
    specificProducts?: IKey[];

    @Prop({ default: 0 })
    appliedCount?: number; //số lượng đã áp dụng

    @Prop({ type: [SchemaTypes.ObjectId], ref: User.name, default: [] })
    appliedClients?: IKey[]; //user applied (còn users is holding => create a collection)

    @Prop({ index: true, select: false, default: true })
    isValid?: boolean; //valid, expired
}

export const DiscountSchema = SchemaFactory.createForClass(Discount);
