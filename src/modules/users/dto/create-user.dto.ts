import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";
import { Gender } from "src/common/enums/gender.enum";

export class CreateUserDto {
    @IsNotEmpty({ message: "Name không thể empty, null hay undefined" })
    @IsString({ message: "Name phải là string" })
    name: string;

    @IsPhoneNumber('VN', { message: "Phone phải là số điện thoại Việt Nam" })
    phone: string;

    @IsEmail({}, { message: "Email phải theo định dạng []@[].[]" })
    email: string;

    // todo: check a strong password
    @IsNotEmpty({ message: "Password không thể empty, null hay undefined" })
    @IsString({ message: "Password phải là string" })
    password: string;

    // todo: check >8 < 150
    age: number;

    @IsEnum(Gender, { message: "Gender phải là male, female hoặc other" })
    gender: string;

    // todo: city, district
    @IsString({ message: "Address phải là string" })
    address: string;

    @IsString({ message: "Avatar phải là string" })
    avatar: string;
}
