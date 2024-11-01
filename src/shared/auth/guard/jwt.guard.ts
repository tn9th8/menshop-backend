import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_SKIP_JWT_KEY } from 'src/common/decorators/skip-jwt.decorator';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
    constructor(
        private reflector: Reflector,
        private readonly userService: UsersService,
    ) {
        super();
    }

    canActivate(context: ExecutionContext) {
        //Add your custom authentication logic here
        //isSkip jwt
        const isSkipAuth = this.reflector.getAllAndOverride<boolean>(IS_SKIP_JWT_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isSkipAuth) {
            return true;
        }
        // super
        return super.canActivate(context);
    }

    handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any) {
        //You can throw an exception based on either "info" or "err" arguments
        //authenticate
        if (err || !user) {
            throw err || new UnauthorizedException('Xác thực không thành công: Không truyền Token');
        }
        //authorize
        const request: Request = context.switchToHttp().getRequest();
        const targetMethod = request.method;
        const targetPath = request.url; //path is the end of the url
        const permissions = user?.permissions ?? []; // ko có trả về rỗng
        console.log(targetMethod + " " + targetPath);

        // throw new ForbiddenException(
        //     'Bạn không có quyền hạn (permission) truy cập endpoint này',
        // );
        return user;
    }
}
