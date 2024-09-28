import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Gender } from "src/common/enums/gender.enum";

export type UserDocument = HydratedDocument<User>;

export interface IUser extends UserDocument {
  _id: mongoose.Types.ObjectId;
  isDeleted: false;
  deletedAt: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

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

  @Prop({ type: String, enum: Object.values(Gender) })
  gender: Gender;

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
