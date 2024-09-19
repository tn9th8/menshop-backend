import { PickType } from "@nestjs/mapped-types";
import { CreateUserDto } from "src/modules/users/dto/create-user.dto";

export class SignUpDto extends PickType(CreateUserDto, ['name', 'email', 'phone', 'password'] as const) {
    verifyToken: string;
    verifyExpires: Date;
}
