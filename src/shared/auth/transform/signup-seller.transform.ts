import { Injectable, PipeTransform } from '@nestjs/common';
import { cleanNullishAttrs } from 'src/common/utils/index.util';
import { SignUpSellerDto } from '../dto/signup-seller.dto';

@Injectable()
export class SignUpSellerTransform implements PipeTransform {

    async transform(value: SignUpSellerDto) {
        let { name, email, phone, password } = value;
        //todo: transform
        const transformed: SignUpSellerDto = cleanNullishAttrs({ name, email, phone, password });
        return transformed;
    }
}
