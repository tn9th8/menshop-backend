import { Injectable, PipeTransform } from '@nestjs/common';
import { QueryNeedDto } from '../dto/query-need.dto';
import { NeedSortEnum } from 'src/common/enums/sort.enum';
import { NeedLevelEnum } from 'src/common/enums/need.enum';
import { toObjetId } from 'src/common/utils/mongo.util';
import { cleanNullishAttrs, toBoolean, toEnum, toNumber } from 'src/common/utils/index.util';

@Injectable()
export class QueryNeedTransform implements PipeTransform {
    // constructor(private readonly needsRepository: NeedsRepository) { }

    async transform(value: QueryNeedDto) {
        let { page, limit, sort, name, level, isPublished, child } = value;
        const transformed = value;

        transformed.page = toNumber(page);
        transformed.limit = toNumber(limit);
        transformed.sort = toEnum(sort, NeedSortEnum);
        //name is string => no transform
        transformed.level = toEnum(level, NeedLevelEnum);
        transformed.isPublished = toBoolean(isPublished);
        transformed.child = toObjetId(child);

        const cleaned: QueryNeedDto = cleanNullishAttrs(transformed);
        return cleaned;
    }
}


