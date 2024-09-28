import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductsService } from '../products.service';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IProduct, Product } from '../schemas/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Clothing, IClothing } from './schema/clothing.schema';
import { CreateProductDto } from '../dto/create-product.dto';

@Injectable()
export class ClothingService extends ProductsService {
    constructor(
        @InjectModel(Product.name)
        protected readonly productModel: SoftDeleteModel<IProduct>,

        @InjectModel(Clothing.name)
        private readonly clothingModel: SoftDeleteModel<IClothing>,
    ) {
        super(productModel);
    }

    async create(createProductDto: CreateProductDto) {
        const clockResult = await this.clothingModel.create((createProductDto as any).attributes);
        if (!clockResult) { throw new BadRequestException('create a Clothing error'); }

        const result = await this.productModel.create(createProductDto);
        if (!result) { throw new BadRequestException('create a Product error'); }
        return result;
    }
}
