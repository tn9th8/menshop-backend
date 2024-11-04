import { Injectable, PipeTransform } from '@nestjs/common';
import { cleanNullishAttrs } from 'src/common/utils/index.util';
import { SignUpClientDto } from '../dto/signup-client.dto';

@Injectable()
export class SignUpClientTransform implements PipeTransform {

    async transform(value: SignUpClientDto) {
        let { name, email, phone, password } = value;
        //todo: transform
        const transformed: SignUpClientDto = { name, email, phone, password };
        return transformed;
    }
}
