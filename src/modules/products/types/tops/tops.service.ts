import { Injectable } from '@nestjs/common';
import { IProductsStrategy } from '../../factory/products.strategy';
import { ProductAttributeDto } from '../../dto/nested-types.dto';

@Injectable()
export class TopsService implements IProductsStrategy {
    constructor() { }


    isValidAttrs(attributes: ProductAttributeDto[]): boolean {
        //todo u1: get cates by type => get requiredAttrs
        const requiredAttrs = ['Cổ áo', 'Tay áo'];
        const attrNames = attributes.map(spec => spec.name);
        const isValid = requiredAttrs.every(attr => attrNames.includes(attr));
        return isValid;
    }
}
