import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAuthUser } from 'src/common/interfaces/auth-user.interface';

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext): IAuthUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});