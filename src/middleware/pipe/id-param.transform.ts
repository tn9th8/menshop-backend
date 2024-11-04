import { Injectable, PipeTransform } from '@nestjs/common';
import { toObjetId } from 'src/common/utils/mongo.util';

@Injectable()
export class IdParamTransform implements PipeTransform {
    transform(id: string) {
        const objectId = toObjetId(id); //can null
        return objectId;
    }
}
