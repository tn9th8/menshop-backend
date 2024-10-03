import { PickType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class CreateAttributesDto extends PickType(CreateProductDto, ['product_shop'] as const) { }
