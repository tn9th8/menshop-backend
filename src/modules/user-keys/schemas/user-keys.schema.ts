import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { User } from "src/common/decorators/user.decorator";
import { IBaseDocument } from "src/common/interfaces/index.interface";
import { IKey } from "src/common/interfaces/index.interface";

export type UserKeyDocument = HydratedDocument<UserKey>;
export type IUserKey = UserKeyDocument & IBaseDocument;

@Schema({ timestamps: true })
export class UserKey {
    //key and ref
    @Prop({ type: SchemaTypes.ObjectId, ref: User.name, unique: true, required: true })
    user: IKey;

    @Prop({ type: [String], required: true })
    refreshToken: string[]; //todo: detect hacker

    @Prop({ default: null })
    verifyToken: string;

    // @Prop({ default: false })
    // isVerified: boolean;
}

export const UserKeySchema = SchemaFactory.createForClass(UserKey);
