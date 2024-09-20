
import { PickType } from "@nestjs/swagger";
import { IsEmail } from "class-validator";
import { CreateUserDto } from "src/modules/users/dto/create-user.dto";

export class SignInDto extends PickType(CreateUserDto, ['password'] as const) {
    @IsEmail({}, { message: "Email phải theo định dạng []@[].[]" })
    username: string;
}
