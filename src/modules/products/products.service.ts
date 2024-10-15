import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './products.repository';
import { IProduct } from './schemas/product.schema';
import { ProductsFactory } from './factory/products.factory';
import { Types } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly productsFactory: ProductsFactory,
  ) { }

  async create(createProductDto: CreateProductDto): Promise<IProduct> {
    const { attributes, shop, categories } = createProductDto;
    if (!shop) { throw new BadRequestException(`Invalid Product Shop: ${shop}`) };

    const isValid = this.productsFactory.isValidAttrs(attributes, categories);
    if (!isValid) { throw new BadRequestException('Invalid Product Attributes') };

    const result = await this.productsRepository.create(createProductDto);
    if (!result) { throw new BadRequestException('Create A Product Error'); }
    return result;
  }

  async findAllIsDraft(shop: Types.ObjectId, limit: number = 60, skip: number = 0): Promise<IProduct[]> {
    //todo: metadata
    let query = {};
    if (shop) {
      query = { ...query, shop };
    }
    query = { ...query, isDraft: true };
    const result = await this.productsRepository.findAllIsDraft(query, limit, skip);
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
