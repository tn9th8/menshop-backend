import { Injectable, PipeTransform } from '@nestjs/common';
import { IPageQuery } from 'src/common/interfaces/query.interface';
import { cleanNullishAttrs, toPageQuery } from 'src/common/utils/index.util';

@Injectable()
export class PageQueryTransform implements PipeTransform {
    transform(value: IPageQuery) {
        value = toPageQuery(value)
        const cleaned: IPageQuery = cleanNullishAttrs(value);
        return cleaned;
    }
}


