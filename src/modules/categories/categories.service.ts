import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { ClientSession, Connection } from 'mongoose';
import { CategoryLevelEnum } from 'src/common/enums/category.enum';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ICategory } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    @InjectConnection()
    private readonly connection: Connection,
  ) { }

  async create(
    createCategoryDto: CreateCategoryDto,
    session: ClientSession | null = null,
  ): Promise<ICategory> {
    let { name, displayName, level, parents, childrenBasedShape, childrenBasedNeed } = createCategoryDto;
    //check unique name
    const isExist = await this.categoriesRepository.isExistNameOrDisplayName(name, displayName);
    if (isExist) { throw new BadRequestException(`name hoặc displayName đã tồn tại: ${name}, ${displayName}`); }
    //create
    if (level === CategoryLevelEnum.CHILD) {
      //should have parents, not have child,
      childrenBasedShape = childrenBasedNeed = undefined;
      if (!parents) { throw new BadRequestException(`parents không hợp lệ: ${parents}`); }
      //create it
      const [createResult] = await this.categoriesRepository.create(
        {
          parents,
          childrenBasedShape,
          childrenBasedNeed,
          ...createCategoryDto,
        },
        session,
      );
      if (!createResult._id) { throw new BadRequestException('Error creating a category'); }
      //should push it to its parent
      await this.categoriesRepository.pushToParents(createResult._id, parents, session)
      //commit
      return createResult;
    } else if (level === CategoryLevelEnum.PARENT) {
      const [createResult] = await this.categoriesRepository.create(createCategoryDto);
      return createResult;
    } else {
      throw new BadRequestException(`level không hợp lệ: ${level}`);
    }
  }

  async createInTran(createCategoryDto: CreateCategoryDto): Promise<ICategory> {
    return this.categoriesRepository.runInsideTransaction<ICategory>(
      (session) => this.create(createCategoryDto, session)
    );
  }

  findAll() {
    return `This action returns all categories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
