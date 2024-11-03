import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { CategoryLevelEnum } from "src/common/enums/category.enum";
import { IBaseDocument } from "src/common/interfaces/index.interface";
import { IKey } from "src/common/interfaces/index.interface";
import { slugPlugin } from "src/common/utils/mongo.util";

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
    @Prop({ type: [String], default: null })
    attributes: string[];
    @Prop({ type: [String], default: null })
    specifications: string[];
    @Prop({ type: [SchemaTypes.ObjectId], ref: Category.name, default: null })
    children: IKey[];
    @Prop({ index: true, default: false, required: true }) //draft or published
    isPublished: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.plugin(slugPlugin);
