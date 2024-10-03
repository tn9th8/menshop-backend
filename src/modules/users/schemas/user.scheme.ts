import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { GenderEnum } from "src/common/enums/gender.enum";
import { IBaseDocument } from "src/common/interfaces/base-document.interface";

export type UserDocument = HydratedDocument<User>;

export interface IUser extends UserDocument, IBaseDocument { }

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
