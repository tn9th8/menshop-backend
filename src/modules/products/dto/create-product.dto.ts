import { Type } from 'class-transformer';
import { ArrayMinSize, MinLength, ValidateNested } from 'class-validator';
import { isArrayMessage, isStringMessage, isObjectMessage, isObjectIdMessage } from 'src/common/utils/validator.util';
import { ProductAssetDto, ProductAttributeDto } from './nested-types.dto';
import { Types } from 'mongoose';
import { IsObjectId } from 'src/common/decorators/is-object-id.decorator';

export class CreateProductDto {
    @MinLength(1, isStringMessage('name'))
    name: string;

    @MinLength(1, isStringMessage('displayName'))
    displayName: string;

    description: string;

    @ValidateNested(isObjectMessage('asset')) //validate nested
    @Type(() => ProductAssetDto) //transform the prop by type
    asset: ProductAssetDto;

    @ArrayMinSize(1, isArrayMessage('attributes'))
    @ValidateNested({ each: true, ...isObjectMessage('mỗi phần tử trong array này') })
    @Type(() => ProductAttributeDto)
    attributes: ProductAttributeDto[];

    //ref
    shop: Types.ObjectId;

    @IsObjectId({ each: true, ...isObjectIdMessage('models') })
    @ArrayMinSize(1, isArrayMessage('models'))
    models: Types.ObjectId[];

    @IsObjectId({ each: true, ...isObjectIdMessage('categories') })
    @ArrayMinSize(1, isArrayMessage('categories'))
    categories: Types.ObjectId[];
}
