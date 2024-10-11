import { ProductsEnum } from "src/common/enums/product.enum";

export const CATEGORY_SAMPLES = () => {
    return [
        {
            _id: ProductsEnum.TOPS,
            type_code: 'tops',
            type_name: 'Quần áo',
        },
        {
            _id: ProductsEnum.WATCHES,
            type_code: 'watches',
            type_name: 'Đồng hồ',
        },
    ];
};

export const TYPE_SAMPLES = () => {
    return [

    ];
};