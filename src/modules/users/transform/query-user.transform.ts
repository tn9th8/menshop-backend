import { Injectable, PipeTransform } from '@nestjs/common';
import { SortEnum } from 'src/common/enums/index.enum';
import { cleanNullishAttrs, toEnum, toNumber } from 'src/common/utils/index.util';
import { UserGenderEnum } from 'src/modules/users/enum/user.enum';
import { QueryUserDto } from '../dto/query-user.dto';

@Injectable()
export class QueryUserTransform implements PipeTransform {
    async transform(value: QueryUserDto) {
        let { page, limit, sort, name, email, phone, gender } = value;

        page = toNumber(page);
        limit = toNumber(limit);
        sort = toEnum(sort, SortEnum);
        //name, phone, email is string => no transform
        gender = toEnum(gender, UserGenderEnum);

        const cleaned: QueryUserDto = cleanNullishAttrs({ page, limit, sort, name, email, phone, gender });
        return cleaned;
    }
}


