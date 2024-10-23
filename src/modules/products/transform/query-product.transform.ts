import { Injectable, PipeTransform } from '@nestjs/common';
import { SortEnum } from 'src/common/enums/index.enum';
import { cleanNullishAttrs, toEnum, toNumber } from 'src/common/utils/index.util';
import { toObjetId } from 'src/common/utils/mongo.util';
import { QueryProductDto } from '../dto/query-product.dto';

@Injectable()
export class QueryProductTransform implements PipeTransform {
    transform(value: QueryProductDto) {
        let { page, limit, sort, name, categories, needs, shop } = value;

        page = toNumber(page);
        limit = toNumber(limit);
        sort = toEnum(sort, SortEnum);
        //name is string => no transform
        categories = toObjetId(categories);
        needs = toObjetId(needs);
        shop = toObjetId(shop);

        const cleaned: QueryProductDto = cleanNullishAttrs(
            { page, limit, sort, name, categories, needs, shop });
        return cleaned;
    }
}
