import { PickType } from "@nestjs/mapped-types";
import mongoose from "mongoose";
import { CreateUserDto } from "src/modules/users/dto/create-user.dto";

export class AuthUserDto extends PickType(CreateUserDto, ['name', 'email', 'phone'] as const) {
    id: mongoose.Types.ObjectId;
}