import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { CategoryLevelEnum, CategoryTypeEnum } from "src/common/enums/category.enum";
import { IBaseDocument } from "src/common/interfaces/base-document.interface";

export type CategoryDocument = HydratedDocument<Category>;
export type ICategory = CategoryDocument & IBaseDocument;

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

    @Prop({ type: String, default: CategoryTypeEnum.CATEGORY, required: true })
    type: CategoryTypeEnum;

    //not required
    // @Prop()
    // position: number;

    @Prop({ type: [mongoose.Schema.ObjectId], ref: Category.name }) //auto init []
    childCategories: mongoose.Types.ObjectId[]; //set

    @Prop({ type: [mongoose.Schema.ObjectId], ref: Category.name }) //auto init []
    childCollections: mongoose.Types.ObjectId[]; //set
}

export const CategorySchema = SchemaFactory.createForClass(Category);
