import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { IBaseDocument } from "src/common/interfaces/index.interface";
import { IPageQuery } from "src/common/interfaces/query.interface";

export type OrderDocument = HydratedDocument<Order>;
export type OrderDoc = OrderDocument & IBaseDocument;
export type OrderPartial = Partial<Order>;
export type OrderQuery = Order & IPageQuery;

@Schema({ timestamps: true })
export class Order { }
export const OrderSchema = SchemaFactory.createForClass(Order);
