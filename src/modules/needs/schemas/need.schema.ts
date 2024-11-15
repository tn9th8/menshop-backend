import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { NeedLevelEnum } from "src/common/enums/need.enum";
import { IBaseDocument } from "src/common/interfaces/index.interface";
import { IKey } from "src/common/interfaces/index.interface";
import { slugPlugin } from "src/common/utils/mongo.util";

export type NeedDocument = HydratedDocument<Need>;
export type INeed = NeedDocument & IBaseDocument;

@Schema({ timestamps: true })
export class Need {
    @Prop({ required: true })
    name: string;

    @Prop() //plugin
    slug: string;

    @Prop({ default: null })
    description: string;

    @Prop({ type: Number, default: NeedLevelEnum.LV1, required: true })
    level: NeedLevelEnum;

    @Prop({ index: true, default: false, required: true }) //draft or published (isOnBar)
    isPublished: boolean;

    //ref
    @Prop({ type: [SchemaTypes.ObjectId], ref: Need.name }) //default []
    children: IKey[];
}

export const NeedSchema = SchemaFactory.createForClass(Need);
NeedSchema.plugin(slugPlugin);
