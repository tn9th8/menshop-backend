import { Injectable } from '@nestjs/common';
import { IProductsStrategy } from '../../factory/products.strategy';
import { ProductAttributeDto } from '../../dto/nested-types.dto';

@Injectable()
export class CustomService implements IProductsStrategy {
    constructor() { }

    isValidAttrs(attributes: ProductAttributeDto[]): boolean {
        return true;
    }
}
