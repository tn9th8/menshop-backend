import { InventoriesRepository } from "src/modules/inventories/inventories.repository";
import { ProductsRepository } from "../products.repository";
import { AddStockToInventory } from "src/modules/inventories/dto/create-inventory.dto";
import { IAuthUser } from "src/common/interfaces/auth-user.interface";
import { NotFoundException } from "@nestjs/common";
import { notFoundMessage } from "src/common/utils/exception.util";

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
}