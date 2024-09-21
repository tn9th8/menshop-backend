import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_MESSAGE } from 'src/common/decorators/api-message.decorator';

export interface Response<T> {
    statusCode: number;
    message?: string;
    data: any;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    constructor(private readonly reflector: Reflector) { }
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        return next
            .handle()
            .pipe(
                map((data) => ({
                    // hàm map(data) lấy data khi controller trả về response
                    statusCode: context.switchToHttp().getResponse().statusCode,
                    message: this.reflector.get<string>(API_MESSAGE, context.getHandler()) || 'Menshop Anonymous Api',
                    data,
                })),
            );
    }
}