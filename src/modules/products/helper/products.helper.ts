import { ProductSortEnum } from "src/common/enums/product.enum";
import { IDbSort } from "src/common/interfaces/index.interface";

export class ProductsHelper {
    toDbSort = (sort: ProductSortEnum) => {
        const dbSort: IDbSort =
            sort == ProductSortEnum.CTIME ? { updatedAt: -1 }
                : sort == ProductSortEnum.RELEVANT ? { updatedAt: -1 }
                    : sort == ProductSortEnum.SALES ? { updatedAt: -1 }
                        : sort == ProductSortEnum.POPULATE ? { updatedAt: -1 }
                            : { updatedAt: -1 };
        return dbSort;
    }
}