import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isExistMessage, notEmptyMessage } from 'src/common/utils/exception.util';
import { cleanNullishAttrs } from 'src/common/utils/index.util';
import { trim } from 'src/common/utils/pipe.util';
import { CreateShopDto } from '../dto/create-shop.dto';
import { ShopsRepository } from '../shops.repository';

@Injectable()
export class CreateShopTransform implements PipeTransform {
    constructor(private readonly shopsRepository: ShopsRepository) { }

    async transform(value: CreateShopDto) {
        let { name, description, image } = value;

        //name: trim, not empty, not exist
        name = trim(name);
        if (!name) {
            throw new BadRequestException(notEmptyMessage('name'));
        }
        if (await this.shopsRepository.isExistByQuery({ name })) {
            throw new BadRequestException(isExistMessage('name'));
        }

        //description: trim
        description = trim(description);

        //name: trim, not empty
        image = trim(image);
        if (!image) {
            throw new BadRequestException(notEmptyMessage('name'));
        }

        const transformed: CreateShopDto = cleanNullishAttrs({ name, description, image });
        return transformed;
    }
}
