import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IProduct, Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsRepo {
  constructor(
    @InjectModel(Product.name)
    protected readonly productModel: SoftDeleteModel<IProduct>
  ) { }

  async create(createProductDto: CreateProductDto) {
    const result = await this.productModel.create(createProductDto);
    return result;
  }

  async findAllIsDraft(limit: number, skip: number, query: {}): Promise<IProduct[]> {
    const result = await this.productModel.find(query)
      //.populate('product_shop', 'name email -_id')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
    return result;
  }
}
