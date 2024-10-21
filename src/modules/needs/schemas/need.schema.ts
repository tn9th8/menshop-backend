import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { NeedLevelEnum } from "src/common/enums/need.enum";
import { IBaseDocument } from "src/common/interfaces/base-document.interface";
import { publishPlugin, slugPlugin } from "src/common/utils/mongo.util";

export type NeedDocument = HydratedDocument<Need>;
export type INeed = NeedDocument & IBaseDocument;

@Schema()
export class Need {
    @Prop({ trim: true, required: true })
    name: string;

    @Prop() //plugin
    slug: string;

    @Prop({ trim: true, required: true })
    description: string;

    @Prop({ type: Number, default: NeedLevelEnum.LV1, required: true })
    level: NeedLevelEnum;

    //ref
    @Prop({ type: [SchemaTypes.ObjectId], ref: Need.name }) //default []
    children: Types.ObjectId[];

    //status
    @Prop({ index: true, select: false, default: false, required: true }) //draft or published (isOnBar)
    isPublished: boolean;

    @Prop({ select: false }) //plugin
    publishedAt: Date;
}

export const NeedSchema = SchemaFactory.createForClass(Need);
NeedSchema.plugin(slugPlugin);
NeedSchema.plugin(publishPlugin);
