import { PartialType } from '@nestjs/mapped-types';
import { IKey } from 'src/common/interfaces/index.interface';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    id: IKey;
}
