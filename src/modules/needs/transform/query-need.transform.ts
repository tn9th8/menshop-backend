import { Injectable, PipeTransform } from '@nestjs/common';
import { QueryNeedDto } from '../dto/query-need.dto';
import { SortEnum } from 'src/common/enums/index.enum';
import { NeedLevelEnum } from 'src/common/enums/need.enum';
import { toObjetId } from 'src/common/utils/mongo.util';
import { cleanNullishAttrs, toBoolean, toEnum, toNumber } from 'src/common/utils/index.util';

@Injectable()
export class QueryNeedTransform implements PipeTransform {
    async transform(value: QueryNeedDto) {
        let { page, limit, sort, name, level, children } = value;

        page = toNumber(page);
        limit = toNumber(limit);
        sort = toEnum(sort, SortEnum);
        //name is string => no transform
        level = toEnum(level, NeedLevelEnum);
        children = toObjetId(children);

        const cleaned: QueryNeedDto = cleanNullishAttrs({ page, limit, sort, name, level, children });
        return cleaned;
    }
}


