import { IKey } from "src/common/interfaces/index.interface";

export class CreateInventoryDto { }

export class AddStockToInventory {
    stock: number;
    product: IKey;
    location: string;
}
