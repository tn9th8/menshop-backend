import { IKey } from "src/common/interfaces/index.interface";

export class CreateKeyStoreDto {
    user: IKey;
    publicKey: string;
    refreshToken: string[];
    refreshExpires?: Date;
}
