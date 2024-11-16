import { BadRequestException, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { isExistMessage, isObjectIdMessage, notEmptyMessage, notFoundIdMessage } from 'src/common/utils/exception.util';
import { cleanNullishAttrs } from 'src/common/utils/index.util';
import { toObjetId } from 'src/common/utils/mongo.util';
import { trim } from 'src/common/utils/validator.util';
import { UpdateShopDto } from '../dto/update-shop.dto';
import { ShopsRepository } from '../shops.repository';

@Injectable()
export class UpdateShopTransform implements PipeTransform {
    constructor(private readonly shopsRepository: ShopsRepository) { }

    async transform(value: UpdateShopDto) {
        let { id, name, description, image, isOpen } = value;

        //id: objectId
        id = toObjetId(id);
        if (!id) {
            throw new BadRequestException(isObjectIdMessage('id param', id))
        }
        if (!await this.shopsRepository.isExistById(id)) {
            throw new NotFoundException(notFoundIdMessage('id param', id));
        }

        //trim name, not empty, not exist
        name = trim(name);
        if (name) {
            if (await this.shopsRepository.isExistByQueryAndExcludeId({ name }, id)) {
                throw new BadRequestException(isExistMessage('name'));
            }
        }
        //description: trim
        description = trim(description);

        //name: trim, not empty
        image = trim(image);

        const transformed: UpdateShopDto = cleanNullishAttrs({ id, name, description, image, isOpen });
        return transformed;
    }
}
