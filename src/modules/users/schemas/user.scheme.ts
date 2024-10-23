import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { GenderEnum } from "src/common/enums/gender.enum";
import { IBaseDocument } from "src/common/interfaces/base-document.interface";

export type UserDocument = HydratedDocument<User>;
export type IUser = UserDocument & IBaseDocument;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop()
  phone: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  role: string;

  @Prop()
  age: number;

  @Prop({ type: String, enum: GenderEnum })
  gender: GenderEnum;

  @Prop()
  address: string;

  @Prop()
  avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
