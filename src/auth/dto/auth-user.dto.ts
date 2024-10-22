
import { PickType } from "@nestjs/swagger";
import mongoose from "mongoose";
import { IsObjectId } from "src/common/decorators/is-object-id.decorator";
import { CreateUserDto } from "src/modules/users/dto/create-user.dto";

export class AuthUserDto extends PickType(CreateUserDto, ['name', 'email', 'phone'] as const) {
    @IsObjectId({ message: "id của AuthUserDto phải là ObjectId" })
    id: mongoose.Types.ObjectId;

    // shop: mongoose.Types.ObjectId;
}