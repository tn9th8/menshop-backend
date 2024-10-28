
import { AuthUserDto } from "./auth-user.dto";

export class AuthCredentialDto {
    accessToken: string;
    user: AuthUserDto;
}