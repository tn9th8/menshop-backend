import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { CategoryLevelEnum, CategoryTypeEnum } from "src/common/enums/category.enum";
import { IBaseDocument } from "src/common/interfaces/base-document.interface";

export type CategoryDocument = HydratedDocument<Category>;
export type ICategory = CategoryDocument & IBaseDocument;
//export interface ICategory extends CategoryDocument, IBaseDocument { }

@Schema()
export class Category {
    @Prop({ trim: true, required: true })
    name: string; //english name

    @Prop({ trim: true, required: true })
    displayName: string; //vietnamese name

    @Prop({ trim: true, required: true })
    description: string;

    @Prop({ type: Number, default: CategoryLevelEnum.PARENT, required: true })
    level: CategoryLevelEnum;

    //position

    //not required
    @Prop({ type: [mongoose.Schema.ObjectId], ref: Category.name }) //auto init []
    childrenBasedShape: mongoose.Types.ObjectId[];

    @Prop({ type: [mongoose.Schema.ObjectId], ref: Category.name })
    childrenBasedNeed: mongoose.Types.ObjectId[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
