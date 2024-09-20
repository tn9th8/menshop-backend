import { SetMetadata } from '@nestjs/common';

export const IS_SKIP_JWT_KEY = 'isSkipJwt';
export const SkipJwt = () => SetMetadata(IS_SKIP_JWT_KEY, true);