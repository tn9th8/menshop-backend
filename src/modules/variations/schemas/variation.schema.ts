import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { IBaseDocument } from "src/common/interfaces/base-document.interface";
import { slugPlugin } from "src/common/utils/mongo.util";

export type VariationDocument = HydratedDocument<Variation>;
export type IVariation = VariationDocument & IBaseDocument;

@Schema()
export class Variation {
    //required
    @Prop({ trim: true, required: true })
    name: string;

    @Prop({ trim: true, required: true })
    displayName: string;

    @Prop()
    slug: string; //plugin

    @Prop({ trim: true, required: true })
    description: string;

    @Prop({ trim: true, required: true })
    type: string;

    @Prop({ type: [String], required: true })
    options: string[];
}

export const CategorySchema = SchemaFactory.createForClass(Variation);
CategorySchema.plugin(slugPlugin);
