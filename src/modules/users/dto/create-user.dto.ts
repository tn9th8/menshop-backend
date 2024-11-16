import { IsArray, IsEmail, IsEmpty, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from "class-validator";
import { UserGenderEnum } from "src/modules/users/enum/user.enum";
import { IKey } from "src/common/interfaces/index.interface";
import { isArrayMessage, isEnumMessage, isNotEmptyMessage, isObjectIdMessage, isStringMessage } from "src/common/utils/validator.util";

export class CreateUserDto {
    @IsString(isStringMessage('name'))
    name: string;
    @IsPhoneNumber('VN', { message: "Phone nên là số điện thoại Việt Nam" })
    phone: string;
    @IsEmail({}, { message: "Email nên theo định dạng []@[].[]" })
    email: string;
    @IsString(isStringMessage('password'))
    password: string; // todo: check a strong password
    @IsMongoId(isObjectIdMessage('role'))
    role: IKey;
    @IsNumber()
    age: number; // todo: check >8 < 150
    @IsEnum(UserGenderEnum, isEnumMessage('gender', UserGenderEnum))
    gender: UserGenderEnum;
    @IsString(isStringMessage('avatar'))
    avatar: string;
}
