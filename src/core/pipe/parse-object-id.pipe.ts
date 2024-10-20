import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { CategoryLevelEnum } from 'src/common/enums/category.enum';
import { CategorySortEnum } from 'src/common/enums/query.enum';
import { isObjectIdMessage } from 'src/common/utils/exception.util';
import { convertToObjetId } from 'src/common/utils/mongo.util';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform {
    transform(id: string) {
        const objectId = convertToObjetId(id);
        if (!objectId) {
            throw new BadRequestException(isObjectIdMessage('id query param', id));
        }
        return objectId;
    }
}
