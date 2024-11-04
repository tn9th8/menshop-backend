import { PERMISSION_PERMISSION_SAMPLES } from "./sub-permissions/permission-perm.samples";

export enum RoleIdEnum {
    SUPER_ADMIN = '67270028882489921392b974',
    NORMAL_ADMIN = '672701aa2f8d80aa32dbbb28',
    NORMAL_SELLER = '672702583fc99fad411eb5e7',
    NORMAL_CLIENT = '672702a9a7b11823367b7206',
}

export const PERMISSION_SAMPLES = () => {
    return [
        ...PERMISSION_PERMISSION_SAMPLES()
    ];
};