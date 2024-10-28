import { PickType } from "@nestjs/swagger";
import { CreateUserDto } from "src/modules/users/dto/create-user.dto";

export class SignUpClientDto extends PickType(CreateUserDto, ['name', 'email', 'phone', 'password'] as const) { }
