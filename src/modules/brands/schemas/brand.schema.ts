import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { BrandComeFromEnum } from "src/common/enums/brand.enum";
import { StatusEnum } from "src/common/enums/status.enum";
import { IBaseDocument } from "src/common/interfaces/base-document.interface";

export type BrandDocument = HydratedDocument<Brand>;
export type IBrand = BrandDocument & IBaseDocument;

@Schema()
export class Brand {
    //required
    @Prop({ trim: true, required: true })
    name: string;

    @Prop({ trim: true, required: true })
    description: string;

    @Prop({ type: String, required: true, default: BrandComeFromEnum.VIETNAM })
    comeFrom: BrandComeFromEnum;

    @Prop({ required: true })
    icon: string;

    @Prop({ required: true })
    image: string;

    @Prop({ type: String, required: true, default: StatusEnum.DRAFT })
    status: StatusEnum;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);

