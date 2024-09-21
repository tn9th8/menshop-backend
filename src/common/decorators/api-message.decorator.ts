import { SetMetadata } from '@nestjs/common';

export const API_MESSAGE = 'api_message';
export const ApiMessage = (message: string) =>
    SetMetadata(API_MESSAGE, message);