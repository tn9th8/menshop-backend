import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductsService } from '../products.service';
import { Clothing, IClothing } from './schema/clothing.schema';

@Injectable()
export class ClothingsService {
    constructor(
        @InjectModel(Clothing.name)
        private readonly clothingModel: SoftDeleteModel<IClothing>,

        private readonly productsService: ProductsService
    ) { }

    async create(createProductDto: CreateProductDto) {
        //todo: any
        //todo: transaction
        const clothingsResult = await this.clothingModel.create((createProductDto as any).attributes);
        if (!clothingsResult) { throw new BadRequestException('create a Clothing error'); }

        const result = await this.productsService.create(createProductDto);
        return result;
    }
}
