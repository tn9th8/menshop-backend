import { SetMetadata } from "@nestjs/common";

export const IS_SKIP_PERMISSION_KEY = 'isSkipPermission';
export const SkipPermission = () => SetMetadata(IS_SKIP_PERMISSION_KEY, true);