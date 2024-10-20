import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { CategoryLevelEnum } from "src/common/enums/category.enum";
import { IBaseDocument } from "src/common/interfaces/base-document.interface";
import { slugPlugin } from "src/common/utils/mongo.util";
import { Brand } from "src/modules/brands/schemas/brand.schema";
import { Need } from "src/modules/needs/schemas/need.schema";
import { Variation } from "src/modules/variations/schemas/variation.schema";

export type CategoryDocument = HydratedDocument<Category>;
export type ICategory = CategoryDocument & IBaseDocument;

@Schema()
export class Category {
    @Prop({ required: true }) //code
    name: string;

    @Prop({ required: true })
    displayName: string;

    @Prop() //plugin
    slug: string;

    @Prop({ default: null })
    description: string;

    @Prop({ type: Number, required: true, default: CategoryLevelEnum.LV3 })
    level: CategoryLevelEnum;

    @Prop({ index: true, select: false, default: false, required: true }) //draft or published
    isPublished: boolean;


    @Prop({ type: [String], default: null })
    attributes: string[];

    @Prop({ type: [String], default: null })
    specifications: string[];

    //ref
    @Prop({ type: [SchemaTypes.ObjectId], ref: Category.name, default: null })
    children: Types.ObjectId[];

    @Prop({ type: [SchemaTypes.ObjectId], ref: Brand.name, default: null })
    brands: Types.ObjectId[];

    @Prop({ type: [SchemaTypes.ObjectId], ref: Variation.name, default: null })
    variations: Types.ObjectId[];

    @Prop({ type: [SchemaTypes.ObjectId], ref: Need.name, default: null })
    needs: Types.ObjectId[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.plugin(slugPlugin);
