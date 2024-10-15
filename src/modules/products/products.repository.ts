import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IProduct, Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterQuery, Types } from 'mongoose';

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
  //QUERY//
  async findAllIsPublishedOrDraft(query: FilterQuery<IProduct>, limit: number, skip: number): Promise<IProduct[]> {
    const result = await this.productModel.find(query)
      .populate('shop', 'name -_id') //email
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
    return result;
  }

  async findByIdAndShop(_id: Types.ObjectId, shop: Types.ObjectId) {
    const found = await this.productModel.find({ _id, shop });
    if (!found) {
      return null;
    }
    return found;
  }
  // END QUERY//

  //UPDATE//
  async updateById(_id: Types.ObjectId, partialDoc: Partial<IProduct>): Promise<number> {
    const { modifiedCount } = await this.productModel.updateOne({ _id }, partialDoc);
    return modifiedCount;
  }
  //END UPDATE//
}
