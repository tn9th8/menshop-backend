import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from '../../dto/create-product.dto';
import { IProductsStrategy } from '../../factory/products.stategy';
import { ProductsRepo } from '../../products.repo';
import { ClothingsRepo } from './clothings.repo';
import mongoose, { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class ClothingsService implements IProductsStrategy {
    constructor(
        private readonly clothingsRepo: ClothingsRepo,
        private readonly productsRepo: ProductsRepo,
        @InjectConnection()
        private readonly connection: Connection,
    ) { }

    async create(createProductDto: CreateProductDto) {
        const session = await this.connection.startSession();
        try {
            session.startTransaction();

            try {
                //create types
                const typesResult = await this.clothingsRepo.create({
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

            }
        } catch (error) {
            //rollback
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}
