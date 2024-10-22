import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { NeedLevelEnum } from "src/common/enums/need.enum";
import { IBaseDocument } from "src/common/interfaces/base-document.interface";
import { publishPlugin, slugPlugin } from "src/common/utils/mongo.util";

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

    //ref
    @Prop({ type: [SchemaTypes.ObjectId], ref: Need.name }) //default []
    children: Types.ObjectId[];

    //status
    @Prop({ index: true, select: false, default: false, required: true }) //draft or published (isOnBar)
    isPublished: boolean;
}

export const NeedSchema = SchemaFactory.createForClass(Need);
NeedSchema.plugin(slugPlugin);
