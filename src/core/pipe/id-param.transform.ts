import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isObjectIdMessage } from 'src/common/utils/exception.util';
import { toObjetId } from 'src/common/utils/mongo.util';

@Injectable()
export class IdParamTransform implements PipeTransform {
    transform(id: string) {
        const objectId = toObjetId(id);
        if (!objectId) {
            throw new BadRequestException(isObjectIdMessage('id param', id));
        }
        return objectId;
    }
}
