import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepo } from './products.repo';
import { IProduct } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepo: ProductsRepo) { }

  async create(createProductDto: CreateProductDto): Promise<IProduct> {
    const result = await this.productsRepo.create(createProductDto);
    if (!result) { throw new BadRequestException('create a Product error'); }
    return result;
  }

  async findAllIsDraft(limit: number = 60, skip: number = 0): Promise<IProduct[]> {
    //todo: metadata
    const query = { isDraft: true };
    const result = await this.productsRepo.findAllIsDraft(limit, skip, query);
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
