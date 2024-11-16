import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { CategoryLevelEnum } from "src/common/enums/category.enum";
import { IBaseDocument, IKey } from "src/common/interfaces/index.interface";

/**
 * define Prop() Attribute
 */
@Schema()
export class CategorySearch {
    @Prop({ default: null })
    name: string;

    @Prop({ default: null })
    value: string;
}

export type CategoryDocument = HydratedDocument<Category>;
export type ICategory = CategoryDocument & IBaseDocument;

@Schema({ timestamps: true })
export class Category {
    @Prop({ required: true })
    name: string;
    @Prop({ default: null })
    description: string;
    @Prop({ type: Number, default: CategoryLevelEnum.LV1, required: true })
    level: CategoryLevelEnum;
    @Prop({ type: [SchemaTypes.ObjectId], ref: Category.name, default: null })
    children: IKey[];
    @Prop({ index: true, default: false, required: true }) //draft or published
    isActive: boolean;
    //search to products
    @Prop({ type: [Object], default: {} })
    search: CategorySearch
    //constraint to products
    @Prop({ type: [String], default: null })
    attributes: string[];
    @Prop({ type: [String], default: null })
    specifications: string[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
