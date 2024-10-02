import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IProduct, Product } from './schemas/product.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    protected readonly productModel: SoftDeleteModel<IProduct>,
  ) { }

  async create(createProductDto: CreateProductDto): Promise<IProduct> {
    const result = await this.productModel.create(createProductDto);
    if (!result) { throw new BadRequestException('create a Product error'); }
    return result;
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
