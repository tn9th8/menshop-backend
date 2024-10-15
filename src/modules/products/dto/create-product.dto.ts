import { Type } from 'class-transformer';
import { ArrayMinSize, MinLength, ValidateNested } from 'class-validator';
import { arrayValidator, stringValidator, nestedValidator, objectIdValidator } from 'src/common/utils/validator.util';
import { ProductAssetDto, ProductAttributeDto } from './nested-types.dto';
import { Types } from 'mongoose';
import { IsObjectId } from 'src/common/decorators/is-object-id.decorator';

export class CreateProductDto {
    @MinLength(1, stringValidator('name'))
    name: string;

    @MinLength(1, stringValidator('displayName'))
    displayName: string;

    description: string;

    @ValidateNested(nestedValidator('asset')) //validate nested
    @Type(() => ProductAssetDto) //transform the prop by type
    asset: ProductAssetDto;

    @ArrayMinSize(1, arrayValidator('attributes'))
    @ValidateNested({ each: true, ...nestedValidator('mỗi phần tử trong array này') })
    @Type(() => ProductAttributeDto)
    attributes: ProductAttributeDto[];


    @IsObjectId({ each: true, ...objectIdValidator('models') })
    @ArrayMinSize(1, arrayValidator('models'))
    models: Types.ObjectId[];

    @IsObjectId({ each: true, ...objectIdValidator('categories') })
    @ArrayMinSize(1, arrayValidator('categories'))
    categories: Types.ObjectId[];
}
