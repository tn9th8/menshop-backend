import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from "class-validator";
import { GenderEnum } from "src/common/enums/gender.enum";
import { isEnumMessage, isStringMessage } from "src/common/utils/pipe.util";

export class CreateUserDto {
    @IsString(isStringMessage('name'))
    name: string;

    @IsPhoneNumber('VN', { message: "Phone nên là số điện thoại Việt Nam" })
    phone: string;

    @IsEmail({}, { message: "Email nên theo định dạng []@[].[]" })
    email: string;

    // todo: check a strong password
    @IsString(isStringMessage('password'))
    password: string;

    // todo: check >8 < 150
    @IsNumber()
    age: number;

    @IsEnum(GenderEnum, isEnumMessage('gender', GenderEnum))
    gender: GenderEnum;

    @IsString(isStringMessage('avatar'))
    avatar: string;
}
