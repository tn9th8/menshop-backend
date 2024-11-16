import { ProductSortEnum } from "src/modules/products/enum/product.enum";
import { IDbSort } from "src/common/interfaces/index.interface";

export class ProductsHelper {
    toDbSort = (sort: ProductSortEnum) => {
        const dbSort: IDbSort =
            sort == ProductSortEnum.CTIME ? { updatedAt: -1 }
                : sort == ProductSortEnum.RELEVANT ? { score: -1, updatedAt: -1 }
                    : sort == ProductSortEnum.SALES ? { sold: -1, updatedAt: -1 }
                        : sort == ProductSortEnum.POPULATE ? { views: -1 }
                            : { updatedAt: -1 };
        return dbSort;
    };
}