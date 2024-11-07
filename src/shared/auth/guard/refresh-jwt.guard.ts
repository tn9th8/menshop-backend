import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshJwtGuard extends AuthGuard('jwt-refresh') {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        //Add your custom authentication logic here
        return super.canActivate(context);
    }

    handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any) {
        //Add logic after authentication: throw an exception, authorize
        if (err || !user)
            throw err || new UnauthorizedException("Xác thực không thành công: Token không hợp lệ");
        return user;
    }

}
