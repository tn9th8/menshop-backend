import { Injectable, PipeTransform } from '@nestjs/common';
import { CategoryLevelEnum } from 'src/common/enums/category.enum';
import { SortEnum } from 'src/common/enums/index.enum';
import { cleanNullishAttrs, toEnum, toNumber } from 'src/common/utils/index.util';
import { toObjetId } from 'src/common/utils/mongo.util';
import { QueryCategoryDto } from '../dto/query-category.dto';

@Injectable()
export class QueryCategoryTransform implements PipeTransform {
    transform(value: QueryCategoryDto) {
        let { page, limit, sort, name, level, children } = value;

        page = toNumber(page);
        limit = toNumber(limit);
        sort = toEnum(sort, SortEnum);
        //name is string => no transform
        level = toEnum(level, CategoryLevelEnum);
        children = toObjetId(children);

        const cleaned: QueryCategoryDto = cleanNullishAttrs(
            { page, limit, sort, name, level, children });
        return cleaned;
    }
}
