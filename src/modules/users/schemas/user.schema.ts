import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { GenderEnum } from "src/common/enums/gender.enum";
import { IBaseDocument, IKey } from "src/common/interfaces/index.interface";
import { IPageQuery } from "src/common/interfaces/query.interface";
import { Role } from "src/modules/roles/schemas/role.schema";

export type UserDocument = HydratedDocument<User>;
export type UserDoc = UserDocument & IBaseDocument;
export type UserPartial = Partial<UserDoc>;
export type UserQuery = User & IPageQuery;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  email: string;
  @Prop()
  phone: string;
  @Prop({ required: true })
  password: string;
  @Prop({ type: [SchemaTypes.ObjectId], ref: Role.name, required: true })
  roles: IKey[];
  @Prop()
  age: number;
  @Prop({ type: String, enum: GenderEnum })
  gender: GenderEnum;
  @Prop()
  avatar: string;
  @Prop({ index: true, default: true, required: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
