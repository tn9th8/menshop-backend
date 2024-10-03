import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { TypeEnum } from "src/common/enums/type.enum";
import { IBaseDocument } from "src/common/interfaces/base-document.interface";

export type TypeDocument = HydratedDocument<Type>;
export interface IType extends TypeDocument, IBaseDocument { }

@Schema()
export class Type {
    @Prop({ required: true })
    type_name: string;

    @Prop({ type: Number, enum: TypeEnum, default: TypeEnum.CATEGORY })
    type_level: TypeEnum;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Type.name })
    type_parent: Type;
}

export const TypeSchema = SchemaFactory.createForClass(Type);
