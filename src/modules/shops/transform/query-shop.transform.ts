import { Injectable, PipeTransform } from '@nestjs/common';
import { SortEnum } from 'src/common/enums/index.enum';
import { cleanNullishAttrs, toBoolean, toEnum, toNumber } from 'src/common/utils/index.util';
import { toObjetId } from 'src/common/utils/mongo.util';
import { QueryShopDto } from '../dto/query-shop.dto';

@Injectable()
export class QueryShopTransform implements PipeTransform {
    async transform(value: QueryShopDto) {
        let { page, limit, sort, name, isMall, seller, isOpen } = value;

        page = toNumber(page);
        limit = toNumber(limit);
        sort = toEnum(sort, SortEnum);
        //name is string => no transform
        isMall = toBoolean(isMall);
        seller = toObjetId(seller);

        const cleaned: QueryShopDto = cleanNullishAttrs({ page, limit, sort, name, isMall, seller, isOpen });
        return cleaned;
    }
}


