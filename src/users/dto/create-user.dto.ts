import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsEmail({},{message: "Email phải theo định dạng []@[].[]"})
    email: string;

    @IsNotEmpty({message: "Password không thể empty, null hay undefined"})
    password: string;

    @IsNotEmpty({message: "Name không thể empty, null hay undefined"})
    name: string;

    age: number;
    gender: string;
    address: string;
}
