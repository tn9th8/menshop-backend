import { Injectable } from '@nestjs/common';
import { IProductsStrategy } from '../../factory/products.strategy';

@Injectable()
export class CustomService implements IProductsStrategy {
    constructor() { }

    isValidAttrs(inputAttrs: [{ name: string; }]): boolean {
        return true;
    }
}
