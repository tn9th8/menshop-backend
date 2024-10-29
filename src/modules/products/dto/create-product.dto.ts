import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { IKey } from 'src/common/interfaces/index.interface';
import { isArrayMessage, isNumberMessage, isNumberOptions, isObjectMessage, isStringMessage } from 'src/common/utils/validator.util';
import { ProductAssetDto, ProductAttributeDto } from './nested-types.dto';

export class CreateProductDto {
    @IsString(isStringMessage('name'))
    name: string; //trim, not empty, not exist

    @IsOptional()
    @IsString(isStringMessage('description'))
    description?: string; //trim

    @IsString(isStringMessage('thumb'))
    thumb: string; //trim, not empty

    @IsNumber(isNumberOptions(), isNumberMessage('stock'))
    stock: number;

    @IsOptional()
    @ValidateNested(isObjectMessage('asset'))
    @Type(() => ProductAssetDto) //transform to validate nested
    asset?: ProductAssetDto; //todo: transform

    @IsOptional()
    @IsArray(isArrayMessage('attributes'))
    @ValidateNested({ each: true, ...isObjectMessage('item của attributes') })
    @Type(() => ProductAttributeDto)
    attributes?: ProductAttributeDto[]; //todo: transform

    //ref
    @IsOptional()
    @IsArray(isArrayMessage('categories'))
    categories: IKey[]; //each: object

    @IsOptional()
    @IsArray(isArrayMessage('categories'))
    needs: IKey[]; //each: object
}
