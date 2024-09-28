import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductsService } from '../products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IProduct, Product } from '../schemas/product.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Clock, IClock } from './schema/clock.schema';

@Injectable()
export class ClocksService extends ProductsService {
    constructor(
        @InjectModel(Product.name)
        protected readonly productModel: SoftDeleteModel<IProduct>,

        @InjectModel(Clock.name)
        private readonly clockModel: SoftDeleteModel<IClock>,
    ) {
        super(productModel);
    }

    async create(createProductDto: CreateProductDto) {
        const clockResult = await this.clockModel.create((createProductDto as any).attributes);
        if (!clockResult) { throw new BadRequestException('create a Clock error'); }

        const result = await this.productModel.create(createProductDto);
        if (!result) { throw new BadRequestException('create a Product error'); }
        return result;
    }

}
