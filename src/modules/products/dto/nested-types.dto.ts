import { MinLength } from "class-validator";
import { stringMessage } from "src/common/utils/validator.util";

export class ProductAssetDto {
    @MinLength(1, stringMessage('name'))
    thumb: string;

    video: string;

    images: string[];

    variationImages: string[];

    sizeChartImage: string;
}

export class ProductAttributeDto {
    @MinLength(1, stringMessage('name'))
    name: string;

    @MinLength(1, stringMessage('value'))
    value: string;

    link: string;
}