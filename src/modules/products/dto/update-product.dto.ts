import { PartialType } from '@nestjs/mapped-types';
import { IKey } from 'src/common/interfaces/index.interface';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    id: IKey;
}

// export class UpdateProductDto extends PartialType(OmitType(CreateProductDto, ['asset', 'attributes'] as const)) {
//     @IsObjectId({ each: true, ...isObjectIdMessage('product') })
//     id: Types.ObjectId;

//     @IsOptional()
//     asset: ProductAssetDto;

//     @IsOptional()
//     attributes: ProductAttributeDto[];
// }
