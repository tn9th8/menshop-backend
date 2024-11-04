import { IKey } from "src/common/interfaces/index.interface";

export class CreateUserKeyDto {
    user: IKey;
    publicKey: string;
    refreshToken: string[];
}
