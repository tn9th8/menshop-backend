import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { UserGenderEnum } from "src/modules/users/enum/user.enum";
import { IBaseDocument, IKey } from "src/common/interfaces/index.interface";
import { IPageQuery } from "src/common/interfaces/query.interface";
import { Role } from "src/modules/roles/schemas/role.schema";

export type UserHydDocument = HydratedDocument<User>;
export type UserDocument = UserHydDocument & IBaseDocument;
export type UserPartial = Partial<UserDocument>;
export type UserQuery = Pick<User, 'name' | 'email' | 'phone'> & IPageQuery;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  email: string;
  @Prop()
  phone?: string;
  @Prop({ required: true })
  password: string;
  @Prop({ type: [SchemaTypes.ObjectId], ref: Role.name, required: true })
  roles: IKey[];
  @Prop()
  age?: number;
  @Prop({ type: String, enum: UserGenderEnum })
  gender?: UserGenderEnum;
  @Prop()
  avatar?: string;
  @Prop({ index: true, default: true, required: true })
  isActive?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
