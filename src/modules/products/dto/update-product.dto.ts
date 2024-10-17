import { PartialType } from '@nestjs/mapped-types';
import { Types } from 'mongoose';
import { IsObjectId } from 'src/common/decorators/is-object-id.decorator';
import { isObjectIdMessage } from 'src/common/utils/validator.util';
import { CreateProductDto } from './create-product.dto';
import { ProductAssetDto, ProductAttributeDto } from './nested-types.dto';
import { IsOptional } from 'class-validator';
import { OmitType } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(OmitType(CreateProductDto, ['asset', 'attributes'] as const)) {
    @IsObjectId({ each: true, ...isObjectIdMessage('product') })
    id: Types.ObjectId;

    @IsOptional()
    asset: ProductAssetDto;

    @IsOptional()
    attributes: ProductAttributeDto[];
}
