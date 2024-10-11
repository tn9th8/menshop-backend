import { Injectable } from '@nestjs/common';
import { IProductsStrategy } from '../../factory/products.strategy';

@Injectable()
export class TopsService implements IProductsStrategy {
    constructor() { }

    isValidAttrs(inputAttrs: [{ name: string; }]): boolean {
        const requiredAttrs = ['Cổ áo', 'Tay áo'];
        const attrNames = inputAttrs.map(spec => spec.name);
        const isValid = requiredAttrs.every(attr => attrNames.includes(attr));
        return isValid;
    }
}
