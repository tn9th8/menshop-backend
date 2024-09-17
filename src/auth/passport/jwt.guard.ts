import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_SKIP_JWT_KEY } from 'src/common/decorators/skip-jwt.decorator';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        // Add your custom authentication logic here
        // for example, call super.logIn(request) to establish a session.
        // is skip auth
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

    handleRequest(err, user, info) {
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }
}
