import { Injectable, PipeTransform } from '@nestjs/common';
import { ProductSortEnum } from 'src/common/enums/product.enum';
import { cleanNullishAttrs, toEnum, toNumber } from 'src/common/utils/index.util';
import { toObjetId } from 'src/common/utils/mongo.util';
import { SearchProductDto } from '../dto/search-product.dto';

@Injectable()
export class SearchProductTransform implements PipeTransform {
    transform(value: SearchProductDto) {
        let { page, limit, sort, keyword, name, categories, needs, shop } = value;

        page = toNumber(page);
        limit = toNumber(limit);
        sort = toEnum(sort, ProductSortEnum);
        //name, keyword
        categories = toObjetId(categories);
        needs = toObjetId(needs);
        shop = toObjetId(shop);

        const cleaned: SearchProductDto = cleanNullishAttrs(
            { page, limit, sort, keyword, name, categories, needs, shop });
        return cleaned;
    }
}
