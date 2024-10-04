import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CreateProductDto } from '../../dto/create-product.dto';
import { ProductsService } from '../../products.service';
import { Clock, IClock } from './schema/clock.schema';
import { IProductsStrategy } from '../../factory/products.stategy';
import { ProductsRepo } from '../../products.repo';
import mongoose, { Connection } from 'mongoose';
import { ClocksRepo } from './clocks.repo';

@Injectable()
export class ClocksService implements IProductsStrategy {
    constructor(
        private readonly clocksRepo: ClocksRepo,
        private readonly productsRepo: ProductsRepo,
        @InjectConnection()
        private readonly connection: Connection,
    ) { }

    async create(createProductDto: CreateProductDto) {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();
            //create type
            const typesResult = await this.clocksRepo.create({
                shop: createProductDto.shop,
                ...createProductDto.attributes,
            });
            if (!typesResult) { throw new BadRequestException('create a Clothing error'); }
            //create product
            const productResult = await this.productsRepo.create({
                _id: typesResult._id,
                ...createProductDto,
            });
            if (!productResult) { throw new BadRequestException('create a Product error'); }
            //commit
            await session.commitTransaction();
            return productResult;
        } catch (error) {
            //rollback
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}

