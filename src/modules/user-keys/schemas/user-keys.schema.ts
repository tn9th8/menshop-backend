import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { IBaseDocument } from "src/common/interfaces/index.interface";
import { IKey } from "src/common/interfaces/index.interface";
import { IPageQuery } from "src/common/interfaces/query.interface";
import { User } from "src/modules/users/schemas/user.schema";

export type UserKeyDocument = HydratedDocument<UserKey>;
export type UserKeyDoc = UserKeyDocument & IBaseDocument;
export type UserKeyPartial = Partial<UserKey>;
export type UserKeyQuery = UserKey & IPageQuery;

@Schema({ timestamps: true })
export class UserKey {
    @Prop({ type: SchemaTypes.ObjectId, ref: User.name, unique: true, required: true })
    user: IKey;

    @Prop({ type: String, default: true })
    refreshToken: string;

    @Prop({ type: [String], required: true })
    refreshTokenUsed: string[];

    @Prop({ default: null })
    verifyToken: string;

    // @Prop({ default: false })
    // isVerified: boolean;
}

export const UserKeySchema = SchemaFactory.createForClass(UserKey);
