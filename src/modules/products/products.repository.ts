import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IProduct, Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterQuery } from 'mongoose';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: SoftDeleteModel<IProduct>
  ) { }

  async create(createProductDto: CreateProductDto) {
    const result = await this.productModel.create(createProductDto);
    return result;
  }

  async findAllIsDraft(query: FilterQuery<IProduct>, limit: number, skip: number): Promise<IProduct[]> {
    const result = await this.productModel.find(query)
      .populate('shop', 'name -_id') //email
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
    return result;
  }
}
