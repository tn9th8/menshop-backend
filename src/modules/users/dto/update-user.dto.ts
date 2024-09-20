
import { IsNotEmpty } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsNotEmpty({ message: "id không thể empty, null hay undefined" })
    id: string;
}
