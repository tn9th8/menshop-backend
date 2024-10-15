import { Type } from 'class-transformer';
import { ArrayMinSize, MinLength, ValidateNested } from 'class-validator';
import { arrayMessage, stringMessage, nestedMessage, objectIdMessage } from 'src/common/utils/validator.util';
import { ProductAssetDto, ProductAttributeDto } from './nested-types.dto';
import { Types } from 'mongoose';
import { IsObjectId } from 'src/common/decorators/is-object-id.decorator';

export class CreateProductDto {
    @MinLength(1, stringMessage('name'))
    name: string;

    @MinLength(1, stringMessage('displayName'))
    displayName: string;

    description: string;

    @ValidateNested(nestedMessage('asset')) //validate nested
    @Type(() => ProductAssetDto) //transform the prop by type
    asset: ProductAssetDto;

    @ArrayMinSize(1, arrayMessage('attributes'))
    @ValidateNested({ each: true, ...nestedMessage('mỗi phần tử trong array này') })
    @Type(() => ProductAttributeDto)
    attributes: ProductAttributeDto[];

    //ref
    shop: Types.ObjectId;

    @IsObjectId({ each: true, ...objectIdMessage('models') })
    @ArrayMinSize(1, arrayMessage('models'))
    models: Types.ObjectId[];

    @IsObjectId({ each: true, ...objectIdMessage('categories') })
    @ArrayMinSize(1, arrayMessage('categories'))
    categories: Types.ObjectId[];
}
