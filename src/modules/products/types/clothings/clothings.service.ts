import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from '../../dto/create-product.dto';
import { IProductsStrategy } from '../../factory/products.stategy';
import { ProductsRepo } from '../../products.repo';
import { ClothingsRepo } from './clothings.repo';
import mongoose from 'mongoose';

@Injectable()
export class ClothingsService implements IProductsStrategy {
    constructor(
        private readonly clothingsRepo: ClothingsRepo,
        private readonly productsRepo: ProductsRepo,
    ) { }

    async create(createProductDto: CreateProductDto) {
        //create clothing
        const clothingsResult = await this.clothingsRepo.create({
            shop: createProductDto.shop,
            ...createProductDto.attributes,
        });
        if (!clothingsResult) { throw new BadRequestException('create a Clothing error'); }
        //create product
        const productResult = await this.productsRepo.create({
            _id: clothingsResult._id,
            ...createProductDto,
        });
        if (!productResult) { throw new BadRequestException('create a Product error'); }
        return productResult;
    }

    async createWithinTransaction(createProductDto: CreateProductDto) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            //create clothing
            const clothingsResult = await this.clothingsRepo.create({
                shop: createProductDto.shop,
                ...createProductDto.attributes,
            });
            if (!clothingsResult) { throw new BadRequestException('create a Clothing error'); }
            //create product
            const productResult = await this.productsRepo.create({
                _id: clothingsResult._id,
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
