import { BadRequestException, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { isExistMessage, isObjectIdMessage, notEmptyMessage, notFoundIdMessage } from 'src/common/utils/exception.util';
import { cleanNullishAttrs } from 'src/common/utils/index.util';
import { toObjetId } from 'src/common/utils/mongo.util';
import { trim } from 'src/common/utils/validator.util';
import { ProductsRepository } from '../products.repository';
import { UpdateProductDto } from '../dto/update-product.dto';
import { CategoriesRepository } from 'src/modules/categories/categories.repository';
import { NeedsRepository } from 'src/modules/needs/needs.repository';

@Injectable()
export class UpdatedProductTransform implements PipeTransform {
    constructor(
        private readonly productRepo: ProductsRepository,
        private readonly categoriesRepo: CategoriesRepository,
        private readonly needsRepo: NeedsRepository
    ) { }

    async transform(value: UpdateProductDto) {
        let { id, name, description, thumb, asset, attributes, categories } = value;

        //id: objectId, get level
        id = toObjetId(id);
        if (!id) {
            throw new BadRequestException(isObjectIdMessage('id param', id))
        }
        if (!await this.productRepo.isExistById(id)) {
            throw new NotFoundException(notFoundIdMessage('id param', id));
        }

        // //trim name, not empty, not exist
        // name = trim(name);
        // if (!name) {
        //     throw new BadRequestException(notEmptyMessage('name'));
        // }
        // if (await this.productRepo.isExistByQueryAndExcludeId({ name }, id)) {
        //     throw new BadRequestException(isExistMessage('name'));
        // }

        // //description: trim
        // description = trim(description);

        // //categories, needs to objectId
        // if (!Array.isArray(categories)) {
        //     categories = null;
        // }
        // else {
        //     categories = await Promise.all(categories.map(async item => {
        //         item = toObjetId(item);
        //         if (!item) { return null; }
        //         const isExist = await this.categoriesRepo.isExistById(item);
        //         return isExist ? item : null;
        //     }));
        //     categories = categories.filter(Boolean); //[]
        //     if (categories.length === 0) {
        //         categories = null;
        //     }
        // }
        //todo: transform
        // const cleaned: UpdateProductDto = cleanNullishAttrs(
        //     { id, name, description, thumb, asset, attributes, categories });
        return value;
    }
}