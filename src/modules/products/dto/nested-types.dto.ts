import { MinLength } from "class-validator";
import { isStringMessage } from "src/common/utils/validator.util";

export class ProductAssetDto {
    @MinLength(1, isStringMessage('thumb'))
    thumb: string;

    video: string;

    images: string[];

    variationImages: string[];

    sizeChartImage: string;
}

export class ProductAttributeDto {
    @MinLength(1, isStringMessage('name'))
    name: string;

    @MinLength(1, isStringMessage('value'))
    value: string;

    link: string;
}