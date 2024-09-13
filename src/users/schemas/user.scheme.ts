import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Gender } from "src/common/enums/gender.enum";

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  age: number;

  @Prop({ type: String, enum: Object.values(Gender) })
  gender: Gender;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop()
  avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
//UserSchema.plugin(softDeletePlugin);
