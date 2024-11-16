import { Injectable, PipeTransform } from '@nestjs/common';
import { SortEnum } from 'src/common/enums/index.enum';
import { cleanNullishAttrs, toEnum, toNumber } from 'src/common/utils/index.util';
import { toObjetId } from 'src/common/utils/mongo.util';
import { CartQuery } from '../schemas/cart.schema';

@Injectable()
export class CartQueryTransform implements PipeTransform {
    async transform(value: CartQuery) {
        let { page, limit, sort, client } = value;

        page = toNumber(page);
        limit = toNumber(limit);
        sort = toEnum(sort, SortEnum);
        client = toObjetId(client);
        // count = toNumber(count);

        const cleaned: CartQuery = cleanNullishAttrs({ page, limit, sort, client });
        return cleaned;
    }
}
