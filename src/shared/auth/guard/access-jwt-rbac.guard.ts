import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IS_SKIP_JWT_KEY } from 'src/common/decorators/skip-jwt.decorator';
import { IS_SKIP_PERMISSION_KEY } from 'src/common/decorators/skip-permission.decorator';
import { IAuthUser } from 'src/common/interfaces/auth-user.interface';

@Injectable()
export class AccessJwtRbacGuard extends AuthGuard('jwt') {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        //Add your custom authentication logic here
        //skip authenticate
        const isSkipAuth = this.reflector.getAllAndOverride<boolean>(IS_SKIP_JWT_KEY, [
            context.getHandler(), context.getClass()
        ]);
        if (isSkipAuth)
            return true;
        //super
        return super.canActivate(context);
    }

    handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any) {
        //Add logic after authentication: throw an exception, authorize
        if (err || !user)
            throw err || new UnauthorizedException("Xác thực không thành công: Token không hợp lệ");
        return user;
        //authorize
        user = this.validateRbac(user, context);
        return user;
    }

    validateRbac(user: IAuthUser, context: ExecutionContext): IAuthUser {
        //skip authorize by decorator
        const isSkipPermission = this.reflector.getAllAndOverride<boolean>(IS_SKIP_PERMISSION_KEY, [
            context.getHandler(), context.getClass()
        ]);
        if (isSkipPermission)
            return user;
        //skip authorize at public resources
        const request: Request = context.switchToHttp().getRequest();
        const targetMethod = request.method;
        const [targetPath = '', targetGroup = '', targetModule = ''] =
            request.route.path.match(/\/api\/v\d+\/(admin|seller|client)\/(.*)?|/);
        if (targetGroup === 'client' || targetGroup === '')
            return user;
        if (targetModule.startsWith('auth'))
            return user;
        //check authorize
        const foundPermission = user.permissions.find(item =>
            targetPath === item.apiPath && targetMethod === item.apiMethod); //or undefined
        if (!foundPermission)
            throw new ForbiddenException('Bạn không có quyền hạn truy cập tài nguyên này');
        //return
        const { id, name, phone, email, roles } = user;
        return { id, name, phone, email, roles };
    }
}
