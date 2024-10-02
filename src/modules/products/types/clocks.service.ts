import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductsService } from '../products.service';
import { Clock, IClock } from './schema/clock.schema';
import { IProductsStrategy } from './strategy/products.stategy';

@Injectable()
export class ClocksService implements IProductsStrategy {
    constructor(
        @InjectModel(Clock.name)
        private readonly clockModel: SoftDeleteModel<IClock>,

        protected readonly productsService: ProductsService
    ) { }

    async create(createProductDto: CreateProductDto) {
        //todo: any
        //todo: transaction
        const clockResult = await this.clockModel.create((createProductDto as any).attributes);
        if (!clockResult) { throw new BadRequestException('create a Clock error'); }

        const productResult = await this.productsService.create(createProductDto);
        return productResult;
    }
}
