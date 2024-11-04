import { Injectable, PipeTransform } from '@nestjs/common';
import { cleanNullishAttrs } from 'src/common/utils/index.util';
import { toObjetId } from 'src/common/utils/mongo.util';

@Injectable()
export class IdBodyTransform implements PipeTransform {
    transform(body: any) {
        let { id, ...attrs } = body;
        id = toObjetId(body.id);
        //to clean partials attrs is nullish
        const partials = cleanNullishAttrs(attrs);
        const cleaned: any = { id, ...partials };
        return cleaned;
    }
}
