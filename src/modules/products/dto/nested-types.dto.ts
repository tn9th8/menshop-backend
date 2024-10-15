import { MinLength } from "class-validator";
import { stringValidator } from "src/common/utils/validator.util";

export class ProductAssetDto {
    @MinLength(1, stringValidator('name'))
    thumb: string;

    video: string;

    images: string[];

    variationImages: string[];

    sizeChartImage: string;
}

export class ProductAttributeDto {
    @MinLength(1, stringValidator('name'))
    name: string;

    @MinLength(1, stringValidator('value'))
    value: string;

    link: string;
}