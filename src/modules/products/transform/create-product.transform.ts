import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { cleanNullishAttrs } from 'src/common/utils/index.util';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductsRepository } from '../products.repository';
import { trim } from 'src/common/utils/validator.util';
import { isExistMessage, notEmptyMessage } from 'src/common/utils/exception.util';
import { toObjetId } from 'src/common/utils/mongo.util';
import { CategoriesRepository } from 'src/modules/categories/categories.repository';
import { NeedsRepository } from 'src/modules/needs/needs.repository';

@Injectable()
export class CreateProductTransform implements PipeTransform {
    constructor(
        private readonly productRepo: ProductsRepository,
        private readonly categoriesRepo: CategoriesRepository
    ) { }

    async transform(value: any) {
        let { name, description, thumb, asset, variationFirst, variationSecond, attributes, stock, price, categories,
            views, likes
        } = value;

        //name: trim, not empty, not exist
        name = trim(name);
        if (!name) {
            throw new BadRequestException(notEmptyMessage('name'));
        }
        if (await this.productRepo.isExistByQuery({ name })) {
            throw new BadRequestException(isExistMessage('name'));
        }
        //description: trim
        description = trim(description);
        //thumb: ""
        thumb = thumb || 'unknown';
        //stock: >=0, default 0
        stock = stock >= 0 ? stock : 0;
        //price: >=0, default 0
        price = price >= 0 ? price : 0;
        //categories to objectId
        if (!Array.isArray(categories)) {
            categories = null;
        }
        else {
            categories = await Promise.all(categories.map(async item => {
                item = toObjetId(item);
                if (!item) { return null; }
                const isExist = await this.categoriesRepo.isExistById(item);
                return isExist ? item : null;
            }));
            categories = categories.filter(Boolean); //[]
            if (categories.length === 0) {
                categories = null;
            }
        }
        //todo: transform
        const cleaned: CreateProductDto = cleanNullishAttrs(
            {
                name, description, thumb, stock, price, asset, variationFirst, variationSecond, attributes, categories,
                views, likes
            });
        return cleaned;
    }
}
