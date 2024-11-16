import { InventoriesRepository } from "src/modules/inventories/inventories.repository";
import { ProductsRepository } from "../products.repository";
import { AddStockToInventory } from "src/modules/inventories/dto/create-inventory.dto";
import { IAuthUser } from "src/common/interfaces/auth-user.interface";
import { Injectable, NotFoundException } from "@nestjs/common";
import { notFoundMessage } from "src/common/utils/exception.util";
import { IKey, IReference } from "src/common/interfaces/index.interface";
import { unselectConst } from "src/common/constant/index.const";

@Injectable()
export class ProductInventoriesService {
    constructor(
        private readonly productsRepo: ProductsRepository,
        private readonly inventoriesRepo: InventoriesRepository,
    ) { }

    //UPSERT//
    async addStockToInventory(body: AddStockToInventory, seller: IAuthUser) {
        //stock: number, productId: IKey, sellerId: IKey, location: string = 'XXX'
        const { stock, product: productId, location } = body;
        const isExist = await this.productsRepo.isExistByQuery({ _id: productId });
        if (!isExist)
            throw new NotFoundException(notFoundMessage('product'));
        const query = { seller: seller.id, product: productId };
        const payload = {
            $in: { stock },
            $set: { location }
        };
        const upserted = await this.inventoriesRepo.upsertOneByQuery(payload, query);
        return upserted ? { updatedCount: 1 } : { updatedCount: 0 };
    }
    //QUERY
    async findOneValidById(productId: IKey, isPublished = true, isActive = true) {
        const query = { _id: productId, isPublished, isActive };
        const refers: IReference[] = [
            { attribute: 'shop', select: ['_id', 'name', 'isMall', 'isActive'] },
            { attribute: 'seller', select: ['_id', 'name', 'role', 'isActive'] },
            { attribute: 'categories', select: ['_id', 'name', 'level', 'isPublished'] },
            // { attribute: 'needs', select: ['_id', 'name', 'level', 'isPublished'] },
        ];
        const found = await this.productsRepo.findOneByQuery(query, [...unselectConst, 'tags'], refers);
        if (!found) {
            throw new NotFoundException(notFoundMessage('product'));
        }
        //inventory
        const queryInven = { product: productId };
        const select = ['sold', 'stock'];
        const foundInven = await this.inventoriesRepo.findOneByQueryRaw(queryInven, select);

        const productInven = { ...found, sold: foundInven.sold, stock: foundInven.stock };

        return productInven;
    }
}