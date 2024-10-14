import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { CategoryLevelEnum } from "src/common/enums/category.enum";
import { IBaseDocument } from "src/common/interfaces/base-document.interface";
import { slugPlugin } from "src/common/utils/mongo.util";
import { Brand } from "src/modules/brands/schemas/brand.schema";
import { Variation } from "src/modules/variations/schemas/variation.schema";

export type CategoryDocument = HydratedDocument<Category>;
export type ICategory = CategoryDocument & IBaseDocument;

//plus: position
@Schema()
export class Category {
    //required
    @Prop({ trim: true, required: true })
    name: string;

    @Prop({ trim: true, required: true })
    displayName: string;

    @Prop()
    slug: string; //plugin

    @Prop({ trim: true, required: true })
    description: string;

    @Prop({ type: Number, default: CategoryLevelEnum.LV1, required: true })
    level: CategoryLevelEnum;

    @Prop({ default: true, required: true })
    isOnBar: boolean;

    @Prop({ type: [String], required: true })
    attributes: string[];

    @Prop({ type: [String], required: true })
    specifications: string[];

    //ref
    @Prop({ type: [SchemaTypes.ObjectId], ref: Category.name })
    children: Types.ObjectId[];

    @Prop({ type: [SchemaTypes.ObjectId], ref: Brand.name })
    brands: Types.ObjectId[];

    @Prop({ type: [SchemaTypes.ObjectId], ref: Variation.name })
    variations: Types.ObjectId[];

    @Prop({ type: [SchemaTypes.ObjectId], ref: Variation.name })
    needs: Types.ObjectId[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.plugin(slugPlugin);
