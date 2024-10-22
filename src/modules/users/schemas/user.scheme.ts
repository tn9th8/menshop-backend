import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, ObjectId } from "mongoose";
import { GenderEnum } from "src/common/enums/gender.enum";
import { IBaseDocument } from "src/common/interfaces/base-document.interface";
import { Shop } from "src/modules/shops/schemas/shop.schema";

export type UserDocument = HydratedDocument<User>;
export type IUser = UserDocument & IBaseDocument;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop()
  phone: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  age: number;

  @Prop({ type: String, enum: GenderEnum })
  gender: GenderEnum;

  @Prop()
  address: string;

  @Prop()
  avatar: string;

  //refer
  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Shop.name })
  // shop: mongoose.Types.ObjectId;

  @Prop()
  refreshToken: string;

  @Prop()
  refreshExpires: Date;

  @Prop()
  verifyToken: string;

  @Prop()
  verifyExpires: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
