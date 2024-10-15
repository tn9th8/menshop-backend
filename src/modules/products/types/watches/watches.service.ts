import { Injectable } from '@nestjs/common';
import { IProductsStrategy } from '../../factory/products.strategy';
import { ProductAttributeDto } from '../../dto/nested-types.dto';

@Injectable()
export class WatchesService implements IProductsStrategy {
    constructor() { }

    isValidAttrs(inputAttrs: ProductAttributeDto[]): boolean {
        const requiredAttrs = ['Chất liệu mặt kính', 'Độ dày mặt', 'Khung viền'];
        const attrNames = inputAttrs.map(spec => spec.name);
        const isValid = requiredAttrs.every(attr => attrNames.includes(attr));
        return isValid;
    }
}

