import { CategoryTypeEnum } from "src/common/enums/category.enum";
import { ProductTypeEnum } from "src/common/enums/product-type.enum";

export const CATEGORY_SAMPLES = () => {
    return [
        // tops parent
        {
            _id: '670942c6860aa76925c2edf2',
            name: 'Tops',
            displayName: 'Áo',
            description: 'Phân loại nhóm áo, thuộc cấp cha.',
            //type: CategoryTypeEnum.PARENT,
            parent: undefined,
        },
        // tops children based class
        // tops children based need

        // watches parent
        {
            _id: '6709435f860aa76925c2edf7',
            name: 'Watches',
            displayName: 'Đồng hồ',
            description: 'Phân loại nhóm đồng hồ, thuộc cấp cha.',
            type: '',
            //parent: CategoryTypeEnum.PARENT,
        },
        // watches children based class
        // watches children based need
    ];
};
