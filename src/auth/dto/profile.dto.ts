import { PickType } from "@nestjs/mapped-types";
import { IsEmail } from "class-validator";
import { CreateUserDto } from "src/modules/users/dto/create-user.dto";

export class ProfileDto extends PickType(CreateUserDto, ['name', 'email', 'phone'] as const) {
    access_token: string;
}
