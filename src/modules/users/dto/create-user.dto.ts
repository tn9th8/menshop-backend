import { IsArray, IsEmail, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from "class-validator";
import { GenderEnum } from "src/common/enums/gender.enum";
import { IKey } from "src/common/interfaces/index.interface";
import { isArrayMessage, isEnumMessage, isObjectIdMessage, isStringMessage } from "src/common/utils/validator.util";

export class CreateUserDto {
    @IsString(isStringMessage('name'))
    name: string;
    @IsPhoneNumber('VN', { message: "Phone nên là số điện thoại Việt Nam" })
    phone: string;
    @IsEmail({}, { message: "Email nên theo định dạng []@[].[]" })
    email: string;
    @IsString(isStringMessage('password'))
    password: string; // todo: check a strong password
    @IsMongoId({ each: true, ...isObjectIdMessage('roles') })
    @IsArray(isArrayMessage('roles'))
    roles: IKey[];
    @IsNumber()
    age: number; // todo: check >8 < 150
    @IsEnum(GenderEnum, isEnumMessage('gender', GenderEnum))
    gender: GenderEnum;
    @IsString(isStringMessage('avatar'))
    avatar: string;
}
