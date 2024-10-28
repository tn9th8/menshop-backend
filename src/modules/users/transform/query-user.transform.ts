import { Injectable, PipeTransform } from '@nestjs/common';
import { SortEnum } from 'src/common/enums/index.enum';
import { NeedLevelEnum } from 'src/common/enums/need.enum';
import { cleanNullishAttrs, toBoolean, toEnum, toNumber } from 'src/common/utils/index.util';
import { toObjetId } from 'src/common/utils/mongo.util';
import { QueryUserDto } from '../dto/query-user.dto';
import { GenderEnum } from 'src/common/enums/gender.enum';

@Injectable()
export class QueryUserTransform implements PipeTransform {
    async transform(value: QueryUserDto) {
        let { page, limit, sort, name, email, phone, gender } = value;

        page = toNumber(page);
        limit = toNumber(limit);
        sort = toEnum(sort, SortEnum);
        //name, phone, email is string => no transform
        gender = toEnum(gender, GenderEnum);

        const cleaned: QueryUserDto = cleanNullishAttrs({ page, limit, sort, name, email, phone, gender });
        return cleaned;
    }
}


