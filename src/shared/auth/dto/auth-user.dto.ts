
import { PickType } from "@nestjs/swagger";
import { IsObjectId } from "src/common/decorators/is-object-id.decorator";
import { IKey } from "src/common/interfaces/index.interface";
import { CreateUserDto } from "src/modules/users/dto/create-user.dto";

export class AuthUserDto extends PickType(CreateUserDto, ['name', 'email', 'phone'] as const) {
    id: IKey;
}
