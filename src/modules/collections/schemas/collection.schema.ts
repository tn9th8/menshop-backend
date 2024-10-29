import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { StatusEnum } from "src/common/enums/status.enum";
import { IBaseDocument } from "src/common/interfaces/index.interface";
import { Product } from "src/modules/products/schemas/product.schema";

export type CollectionDocument = HydratedDocument<Collection>;
export type ICollection = CollectionDocument & IBaseDocument;

@Schema()
export class Collection {
    //required
    @Prop({ trim: true, required: true })
    name: string;

    @Prop({ trim: true, required: true })
    description: string;

    @Prop({ type: [SchemaTypes.ObjectId], ref: Product.name, required: true })
    products: Types.ObjectId[]

    @Prop({ type: String, required: true, default: StatusEnum.DRAFT })
    status: StatusEnum;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);
