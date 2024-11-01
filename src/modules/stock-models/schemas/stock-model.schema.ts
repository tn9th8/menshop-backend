import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { IBaseDocument } from "src/common/interfaces/index.interface";
import { Shop } from "src/modules/shops/schemas/shop.schema";
import { ModelSpecification, ModelSpecificationSchema } from "./nested.schemas";

export type StockModelDocument = HydratedDocument<StockModel>;
export type IStockModel = StockModelDocument & IBaseDocument;

@Schema()
export class StockModel {
    //required
    @Prop({ trim: true, required: true })
    name: string;

    @Prop({ trim: true, required: true })
    sku: string;

    @Prop({ type: [Number], required: true })
    variationIndex: [number, number];

    @Prop({ required: true })
    price: number;

    @Prop()
    discountPrice: number;

    @Prop()
    discount: number; //unit: %

    sold: number;

    stock: number;

    weight: number;

    estimatedDate: Date;

    @Prop({ required: true, default: false })
    isPreOrder: boolean;

    @Prop({ required: true, default: false })
    isStop: boolean;

    @Prop({ type: [ModelSpecificationSchema], required: true })
    specifications: ModelSpecification[] //mongodb attribute pattern

    //refer
    @Prop({ type: SchemaTypes.ObjectId, ref: Shop.name, required: true })
    shop: Types.ObjectId;
}

export const StockModelSchema = SchemaFactory.createForClass(StockModel);
