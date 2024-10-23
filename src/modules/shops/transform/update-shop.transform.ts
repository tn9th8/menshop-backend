import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { isExistMessage, isObjectIdMessage, notEmptyMessage, notFoundIdMessage } from 'src/common/utils/exception.util';
import { cleanNullishAttrs } from 'src/common/utils/index.util';
import { toObjetId } from 'src/common/utils/mongo.util';
import { trim } from 'src/common/utils/pipe.util';
import { CreateShopDto } from '../dto/create-shop.dto';
import { UpdateShopDto } from '../dto/update-shop.dto';
import { ShopsRepository } from '../shops.repository';

@Injectable()
export class UpdateShopTransform {
    constructor(private readonly shopsRepository: ShopsRepository) { }

    async transform(value: UpdateShopDto) {
        let { id, name, description, image } = value;
        const transformed = value;

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
        if (!name) {
            throw new BadRequestException(notEmptyMessage('name'));
        }
        if (await this.shopsRepository.isExistByQueryAndExcludeId({ name }, id)) {
            throw new BadRequestException(isExistMessage('name'));
        }
        transformed.name = name;

        //description: trim
        description = trim(description);
        transformed.description = description;

        //name: trim, not empty
        image = trim(image);
        if (!image) {
            throw new BadRequestException(notEmptyMessage('name'));
        }
        transformed.image = image;

        const cleaned: UpdateShopDto = cleanNullishAttrs(transformed);
        return cleaned;
    }
}
