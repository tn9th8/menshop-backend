import { ProductsEnum } from "src/common/enums/product.enum";

export const CATEGORY_SAMPLES = () => {
    return [
        {
            _id: ProductsEnum.CLOTHINGS,
            type_code: 'tops',
            type_name: 'Quần áo',
        },
        {
            _id: ProductsEnum.CLOCKS,
            type_code: 'watches',
            type_name: 'Đồng hồ',
        },
        {
            _id: ProductsEnum.GLASSES,
            type_code: 'glasses',
            type_name: 'Mắt kính',
        },
    ];
};

export const TYPE_SAMPLES = () => {
    return [

    ];
};