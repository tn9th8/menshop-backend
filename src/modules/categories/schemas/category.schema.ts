import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { CategoryTypeEnum } from "src/common/enums/category-type.enum";
import { IBaseDocument } from "src/common/interfaces/base-document.interface";

export type CategoryDocument = HydratedDocument<Category>;
export type ICategory = CategoryDocument & IBaseDocument;

@Schema()
export class Category {
    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ required: true, trim: true })
    displayName: string;

    @Prop({ required: true, trim: true })
    description: string;

    @Prop({ required: true, type: String, default: CategoryTypeEnum.PARENT })
    level: CategoryTypeEnum;

    //not required
    @Prop({ type: mongoose.Schema.ObjectId, ref: Category.name })
    parent: mongoose.Types.ObjectId;

}

export const CategorySchema = SchemaFactory.createForClass(Category);
